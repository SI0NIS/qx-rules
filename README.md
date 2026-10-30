# qx-rules

自用 Quantumult X 规则合集。

## 文件

| 文件 | 用途 | 引用方式 |
|---|---|---|
| `hupu-ad.conf` | 虎扑去广告（重写 + MitM），引用后自动加载下面的 JS | QX → 重写 → 引用 |
| `hupu_ad.js` | 实际改写响应体的脚本，被 `hupu-ad.conf` 引用，无需单独添加 | 自动加载 |
| `bodian-ad.conf` | 波点音乐去广告（重写 + MitM） | QX → 重写 → 引用 |
| `bodian_ad.js` | 波点脚本，被 `bodian-ad.conf` 引用 | 自动加载 |

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

## 波点音乐去广告

QX → 重写 → 引用 `bodian-ad.conf`，MitM 域名 `bd-api.kuwo.cn`。

处理范围（基于 854 请求 HAR 实测）：

| 接口 | 处理 |
|---|---|
| `service/home/index` | 从 moduleList 剔除 `type=8`「广告」模块，清空 bannerList |
| `popup/{mine,scene,start}/info` | 清空 data，保留响应外壳 |
| `service/v2/openscreen/index` | 开屏配置清空 |
| `service/advert/config`、`banner/positions`、`play/advert/info`、`rec/feed` | 返回官方无广告格式 `{"code":439,"data":{}}` |
| `service/conf/all` | `adStartAppDialog`/`adGuideTest`/`adExitChange` 置 0，其余 33 项配置不动 |

**不屏蔽**：`advert/earning/**`（看广告赚金币，主动功能）、`car-er/car-lv/car-lw.kuwo.cn`（音频 CDN，屏蔽会导致无法播放）、`mobi.kuwo.cn/mobi.s`（播放地址解析）。
