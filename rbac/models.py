from django.db import models
from django.contrib.auth.models import AbstractUser


class Menu(models.Model):
    """
    菜单
    """
    title = models.CharField(max_length=32, unique=True)
    sort = models.IntegerField(verbose_name='显示顺序', default=1)
    icon = models.CharField(verbose_name='菜单图标', max_length=32)
    parent = models.ForeignKey("Menu", null=True, blank=True, on_delete=models.CASCADE)

    # 定义菜单间的自引用关系
    # 权限url 在 菜单下；菜单可以有父级菜单；还要支持用户创建菜单，因此需要定义parent字段（parent_id）
    # blank=True 意味着在后台管理中填写可以为空，根菜单没有父级菜单

    def __str__(self):
        # 显示层级菜单
        title_list = [self.title]
        p = self.parent
        while p:
            title_list.insert(0, p.title)
            p = p.parent
        return '-'.join(title_list)

    class Meta:
        verbose_name = '菜单'
        verbose_name_plural = verbose_name


class Permission(models.Model):
    """
    权限
    """
    title = models.CharField(max_length=32, unique=True)
    url = models.CharField(max_length=128, unique=True)
    menu = models.ForeignKey("Menu", null=True, blank=True, on_delete=models.CASCADE)
    # 跟自身表关联，已经是菜单的就可以不关联null=True
    # 非菜单的权限，要选一个母菜单。当选中该权限时就可以归类跳转到母菜单下
    pid = models.ForeignKey(verbose_name='关联的权限', to='Permission', null=True, blank=True, related_name='parents',
                            help_text='非菜单的权限，要选一个母菜单。当选中该权限时就可以归类跳转到母菜单下', on_delete=models.CASCADE)

    def __str__(self):
        # 显示带菜单前缀的权限
        return '{menu}---{permission}'.format(menu=self.menu, permission=self.title)

    class Meta:
        verbose_name = '权限'
        verbose_name_plural = verbose_name


class Role(models.Model):
    """
    角色：绑定权限
    """
    title = models.CharField(verbose_name='角色名称', max_length=32, unique=True)
    permissions = models.ManyToManyField("Permission", verbose_name='拥有的所有权限')

    # 定义角色和权限的多对多关系

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = '角色'
        verbose_name_plural = verbose_name


class User(AbstractUser):
    """
    用户：划分角色
    """
    username = models.CharField(verbose_name='用户', max_length=32, unique=True)

    roles = models.ManyToManyField(verbose_name='角色', to="Role")

    # 定义用户和角色的多对多关系

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = '用户'
        verbose_name_plural = verbose_name
