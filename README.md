# Bootstrap 4 脚手架
A [Bootstrap](https://getbootstrap.com/) 4.0 (Beta 3) boiler plate with [sass](http://sass-lang.com/), concatenation, minification, autoprefixer, [Browsersync](https://www.browsersync.io/), hot reloading and sourcemaps all runned by [Gulp](https://gulpjs.com/)

![bootstrap logo](https://user-images.githubusercontent.com/10498583/31125543-e2a88c2c-a848-11e7-87b0-d20ea38d41d0.jpg)
![sass logo](https://user-images.githubusercontent.com/10498583/31125541-e2a732e6-a848-11e7-959d-7d7b0c138124.jpg)
![gulp logo](https://user-images.githubusercontent.com/10498583/31125542-e2a78b88-a848-11e7-8ac5-c396f46e811f.jpg)
![browsersync logo](https://user-images.githubusercontent.com/10498583/31125540-e2a6eed0-a848-11e7-817a-69c5619f772a.jpg)

## Quick Start
```
# 1 克隆仓库
git clone https://github.com/cnzi/geling.git

# 2 进入目录
cd geling

# 3 安装依赖
npm install

# 4 启动脚本
gulp serve 启动本地预览服务
gulp 生成dist文件
```

## 脚本相关

### 前端模板引擎
前端模板引起在浏览器中使用js，生成html文件插入到页面中，本项目使用jquery tmpl模板引擎，[教程]("https://www.cnblogs.com/zhuzhiyuan/p/3510175.html")

首页在页面中定义模板
```
<script id="articleTemplate" type="text/x-jquery-tmpl">
    {{each(i, item) list}}
    <a href="/portal/game/article?id=${item.id}">
        <div class="container pageListItem">
            <div class="row">
                <div class="text-right cover col-5 col-sm-4 ">
                    <img src="${item.more.thumbnail}" alt="">
                </div>
                <div class="text-left col-7 col-sm-8 pageListItemRight">
                    <h2 class="title">${item.post_title}</h2>
                    <p>${item.post_excerpt}</p>
                    <div class="time">${item.published_time.split(' ')[0]}</div>
                </div>
            </div>
        </div>
    </a>
    {{/each}}
</script>
```

使用ajax，请求数据，生成html，插入页面中
```
$.ajax({
    dataType: "json",
    url: "http://itecon.org/api/portal/lists/getDefaultCategoryPostLists?field=post.id,post_excerpt,post_title,published_time,more&limit=6",
    success: function(r) {
        $("#articleTemplate").tmpl({
            list: r.data.list,
        }).appendTo("#articleList");
    }
});
```
