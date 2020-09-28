# Orders and order cycles

The GSSB library switched to an order-and-pickup model during 2020/2021
school year because of the closure of the physical school due to the
COVID-19 pandemic.

This package contains the functionality supporting this model.

An `OrderCycle` models the two-week period for the orders and pick-up.
Borrowers can order items during the order window of an order cycle.
This order window starts shortly after the last pickup and end two
days before the next pickup.

Each borrower has zero or one `Order` associated with an `OrderCycle`.
The system creates the `Order` for a borrower and order cycle when the
borrower orders the first item during an order window.



