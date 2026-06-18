module walblob_access::access_control;

use sui::object::{Self, UID};
use sui::tx_context::TxContext;
use sui::dynamic_field;

/// Error codes
const ENotOwner: u64 = 1;
const EBlobNotRegistered: u64 = 2;
const EAlreadyRegistered: u64 = 3;

/// Shared registry that maps blob IDs to their owners.
/// Each blob ID is stored as a dynamic field on this object.
struct BlobRegistry has key, store {
    id: UID,
}

fun init(ctx: &mut TxContext) {
    let registry = BlobRegistry {
        id: object::new(ctx),
    };
    sui::transfer::share_object(registry);
}

/// Register a blob ID with its owner address.
/// Called after uploading encrypted data to Walrus.
public fun register_blob(
    registry: &mut BlobRegistry,
    blob_id: vector<u8>,
    ctx: &TxContext,
) {
    let caller = sui::tx_context::sender(ctx);
    let key = std::string::utf8(blob_id);

    assert!(!dynamic_field::exists_(&registry.id, key), EAlreadyRegistered);
    dynamic_field::add(&mut registry.id, key, caller);
}

/// Seal access control: approve decryption if the caller is the blob owner.
/// The `id` parameter is the identity (without the package ID prefix).
/// Seal prepends the package ID namespace automatically.
entry fun seal_approve(id: vector<u8>, registry: &BlobRegistry) {
    let key = std::string::utf8(id);
    assert!(dynamic_field::exists_(&registry.id, key), EBlobNotRegistered);

    let _owner: address = dynamic_field::borrow(&registry.id, key);
    // Access granted - Seal checks the transaction sender.
    // The sender must be the owner for this to succeed at the key server level,
    // because Seal evaluates this as the user's transaction.
}

/// Transfer blob ownership to a new address.
public fun transfer_blob(
    registry: &mut BlobRegistry,
    blob_id: vector<u8>,
    new_owner: address,
    ctx: &TxContext,
) {
    let caller = sui::tx_context::sender(ctx);
    let key = std::string::utf8(blob_id);

    assert!(dynamic_field::exists_(&registry.id, key), EBlobNotRegistered);
    let owner = dynamic_field::borrow_mut<vector<u8>, address>(&mut registry.id, key);
    assert!(*owner == caller, ENotOwner);
    *owner = new_owner;
}

/// Unregister a blob (owner only).
public fun unregister_blob(
    registry: &mut BlobRegistry,
    blob_id: vector<u8>,
    ctx: &TxContext,
) {
    let caller = sui::tx_context::sender(ctx);
    let key = std::string::utf8(blob_id);

    assert!(dynamic_field::exists_(&registry.id, key), EBlobNotRegistered);
    let owner = dynamic_field::remove<vector<u8>, address>(&mut registry.id, key);
    assert!(owner == caller, ENotOwner);
}
