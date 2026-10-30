// 虎扑去广告 —— 按 URL 分发处理
// 1. goblin.hupu.com 开屏/通用广告位
// 2. games.mobileapi.hupu.com 搜索页横幅广告
const url = $request.url;
let o = {};
try {
  o = JSON.parse($response.body) || {};
} catch (e) {
  o = {};
}

if (/\/interfaceAd\/getOther/.test(url)) {
  o.ad_code = -41;
  o.show_type = 0;
  o.ads = [];
} else if (/\/search\/v2\/hintkeylist/.test(url)) {
  // 实测响应: result.banner = {ad_type:"22000000", is_ad:1, position:"0"}
  if (o.result) {
    o.result.banner = null;
    delete o.result.ad_page_id;
  }
}

$done({ body: JSON.stringify(o) });
