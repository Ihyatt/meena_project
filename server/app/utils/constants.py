import enum


class PaymentStatus(enum.Enum):
    PENDING = 'pending'
    SUCCEEDED = 'succeeded'
    FAILED = 'failed'
    REFUNDED = 'refunded'

class EmailStatus(enum.Enum):
    QUEUED = 'queued'
    SENT = 'sent'
    DELIVERED = 'delivered'
    BOUNCED = 'bounce'
    BLOCKED = 'blocked'
    SPAM = 'spam'
    OPENED = 'open'
    CLICKED = 'click'
    FAILED = 'failed'

class CurrencyCode(enum.Enum):
    AUD = "AUD"
    EUR = "EUR"
    BRL = "BRL"
    CAD = "CAD"
    XOF = "XOF"
    HRK = "EUR"
    CZK = "CZK"
    DKK = "DKK"
    GHS = "GHS"
    GIP = "GIP"
    HKD = "HKD"
    HUF = "HUF"
    INR = "INR"
    IDR = "IDR"
    JPY = "JPY"
    KES = "KES"
    CHF = "CHF"
    MYR = "MYR"
    MXN = "MXN"
    NZD = "NZD"
    NGN = "NGN"
    NOK = "NOK"
    PLN = "PLN"
    RON = "RON"
    SGD = "SGD"
    ZAR = "ZAR"
    SEK = "SEK"
    THB = "THB"
    AED = "AED"
    GBP = "GBP"
    USD = "USD"