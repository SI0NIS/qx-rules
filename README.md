# qx-rules

自用 Quantumult X 规则合集。

## 文件

| 文件 | 用途 | 引用方式 |
|---|---|---|
| `hupu-ad.conf` | 虎扑去广告（重写 + MitM），引用后自动加载下面的 JS | QX → 重写 → 引用 |
| `hupu_ad.js` | 实际改写响应体的脚本，被 `hupu-ad.conf` 引用，无需单独添加 | 自动加载 |

## 虎扑去广告

### 1. 添加重写引用

QX → 设置 → 重写 → 引用 → 添加：

```
https://cdn.jsdelivr.net/gh/SI0NIS/qx-rules@main/hupu-ad.conf
```

> 用 jsDelivr 而不是 raw.githubusercontent.com：后者在国内容易连不上，QX 拉不到资源。

### 2. 分流（可选）

在本地 `[filter_local]` 里加一行，让广告域名不走代理：

```
HOST-SUFFIX, goblin.hupu.com, DIRECT
```

### 3. 打开 MitM

设置 → MitM → 生成并安装证书，同时在 iOS 设置 → 通用 → 关于本机 → 证书信任设置 里打开信任。**不开这一步整条规则都不生效**，因为 HTTPS 请求不会被解密。

## 原理

虎扑广告接口 `interfaceAd/getOther` 返回 `{"ad_code":...,"show_type":...,"ads":[...]}`。规则把整个响应体替换成 `{"ad_code":-41,"show_type":0,"ads":[]}`（空列表），App 解析后无广告可展示。

`-41` 是原 Surge 社区配置沿用的错误码约定，若 App 对空 `ads` 仍显示占位，可尝试改成 `0`。

## 注意

- QX 没有 Surge 的 `DOMAIN-SUFFIX` 和 `response.body.mock`，语法已按 QX 改写。
- 规则只对 `goblin.hupu.com` 生效，其他广告域名（如 `ad.hupu.com`）需要另加。
