;; aboki-escrow-lite.clar
(define-data-var buyer principal tx-sender)
(define-data-var seller principal tx-sender)
(define-data-var balance uint u0)
(define-data-var approved bool false)

(define-public (deposit (seller-address principal))
    (let 
        (
            (amount u1000)
            (self (as-contract tx-sender)) ;; FIX: Capture contract address here
        ) 
        ;; Now use 'self' instead of the complex function call
        (try! (stx-transfer? amount tx-sender self))
        (var-set buyer tx-sender)
        (var-set seller seller-address)
        (var-set balance amount)
        (ok (var-set approved false))
    )
)

(define-public (approve)
    (begin
        (asserts! (is-eq tx-sender (var-get buyer)) (err u403))
        (ok (var-set approved true))
    )
)

(define-public (withdraw)
    (begin
        (asserts! (is-eq tx-sender (var-get seller)) (err u403))
        (asserts! (var-get approved) (err u401))
        (try! (as-contract (stx-transfer? (var-get balance) tx-sender (var-get seller))))
        (ok (var-set balance u0))
    )
)