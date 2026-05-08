#![allow(ambiguous_glob_reexports)]

pub mod allocate_next_bed;
pub mod burn_care_and_upgrade;
pub mod cancel_queue_entry;
pub mod confirm_admission;

pub mod initialize_queue;
pub mod join_p3_queue;
pub mod register_p1_from_nft;

#[allow(unused_imports)]
pub use allocate_next_bed::*;
#[allow(unused_imports)]
pub use burn_care_and_upgrade::*;
#[allow(unused_imports)]
pub use cancel_queue_entry::*;
#[allow(unused_imports)]
pub use confirm_admission::*;
pub use initialize_queue::*;
#[allow(unused_imports)]
pub use join_p3_queue::*;
#[allow(unused_imports)]
pub use register_p1_from_nft::*;
