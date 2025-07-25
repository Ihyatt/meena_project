from sqlalchemy_easy_softdelete.mixin import generate_soft_delete_mixin_class
from datetime import datetime

class SoftDeleteMixin(generate_soft_delete_mixin_class()):
    deleted_at: datetime

