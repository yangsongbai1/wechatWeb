from django.db import models

from rbac.models import User

import datetime


def get_img_path(instance, filename):
    now = datetime.datetime.now()
    format_now = (now.year, now.month, now.day, filename)
    img_path = 'WeChatTask/screenshots/%s/%s/%s/%s' % format_now
    return img_path


class WeChatTask(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE, verbose_name="用户",
                             related_name="wechattask_user")
    input_time = models.DateTimeField(verbose_name='录入时间', auto_now_add=True)
    submit_time = models.DateTimeField(verbose_name='提交时间', null=True, blank=True)
    pass_time = models.DateTimeField(verbose_name='通过时间', null=True, blank=True)
    reject_time = models.DateTimeField(verbose_name='驳回时间', null=True, blank=True)
    audit_status = models.IntegerField(verbose_name='null-处理中，0-审核中等待回传，1-通过已回传，2-未通过', null=True, blank=True)
    is_back = models.IntegerField(verbose_name='0-未回传,1-已回传，暂弃用', default=0)

    sub_taskId = models.CharField(verbose_name='子任务id', max_length=32)
    type = models.IntegerField(verbose_name='7-点赞任务')
    userId = models.CharField(verbose_name='发布任务用户id', max_length=32)
    taskId = models.CharField(verbose_name='任务id，一个taskId下会有N个子任务id', max_length=32)
    url = models.CharField(verbose_name='需要执行任务的链接地址', max_length=512)
    content = models.TextField(verbose_name='转发任务时需要评论的内容')
    deadline_time = models.CharField(verbose_name='截止时间(endTime)', max_length=32, null=True, blank=True)

    # nickname = models.CharField(verbose_name='执行任务的账号名', max_length=512, null=True, blank=True)
    description = models.CharField(verbose_name='任务结果描述 （必须要有结果描述）', max_length=256, null=True, blank=True)
    ctime = models.DateTimeField(verbose_name='执行任务时间', null=True, blank=True)

    class Meta:
        app_label = "WeChatTask"
        managed = True
        db_table = 'wechat_task'
        verbose_name = '微信点赞任务'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.id


class TaskImg(models.Model):
    wechat_task = models.ForeignKey(WeChatTask, on_delete=models.CASCADE, verbose_name='任务')
    upload_time = models.DateTimeField(auto_now_add=True, verbose_name='上传时间')
    is_del = models.IntegerField(verbose_name='是否删除', default=0)
    img = models.ImageField(upload_to=get_img_path, verbose_name='图片地址')

    class Meta:
        app_label = "WeChatTask"
        managed = True
        db_table = 'wechat_task_img'
        verbose_name = '微信点赞任务截图'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.img.name
