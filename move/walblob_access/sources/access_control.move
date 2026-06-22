module walblob_access::access_control;

use sui::object::{Self, UID};
use sui::tx_context::TxContext;
use sui::dynamic_field;

const ENotOwner: u64 = 1;
const EBlobNotRegistered: u64 = 2;
const EAlreadyRegistered: u64 = 3;

public struct BlobRegistry has key, store {
    id: UID,
}

fun init(ctx: &mut TxContext) {
    let registry = BlobRegistry {
        id: object::new(ctx),
    };
    sui::transfer::share_object(registry);
}

public fun register_blob(
    registry: &mut BlobRegistry,
    blob_id: vector<u8>,
    ctx: &TxContext,
) {
    let caller = sui::tx_context::sender(ctx);
    assert!(!dynamic_field::exists<vector<u8>>(&registry.id, blob_id), EAlreadyRegistered);
    dynamic_field::add<vector<u8>, address>(&mut registry.id, blob_id, caller);
}

entry fun seal_approve(id: vector<u8>, registry: &BlobRegistry) {
    assert!(dynamic_field::exists<vector<u8>>(&registry.id, id), EBlobNotRegistered);
}

public fun transfer_blob(
    registry: &mut BlobRegistry,
    blob_id: vector<u8>,
    new_owner: address,
    ctx: &TxContext,
) {
    let caller = sui::tx_context::sender(ctx);
    assert!(dynamic_field::exists<vector<u8>>(&registry.id, blob_id), EBlobNotRegistered);
    let owner = dynamic_field::borrow_mut<vector<u8>, address>(&mut registry.id, blob_id);
    assert!(*owner == caller, ENotOwner);
    *owner = new_owner;
}

public fun unregister_blob(
    registry: &mut BlobRegistry,
    blob_id: vector<u8>,
    ctx: &TxContext,
) {
    let caller = sui::tx_context::sender(ctx);
    assert!(dynamic_field::exists<vector<u8>>(&registry.id, blob_id), EBlobNotRegistered);
    let owner = dynamic_field::remove<vector<u8>, address>(&mut registry.id, blob_id);
    assert!(owner == caller, ENotOwner);
}
