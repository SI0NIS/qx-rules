// 虎扑去广告 —— response-body 脚本方案（备用）
// 用法：QX 重写行末尾改成 script-response-body + 本文件 URL
let o = {};
try {
  o = JSON.parse($response.body) || {};
} catch (e) {
  o = {};
}
o.ad_code = -41;
o.show_type = 0;
o.ads = [];
$done({ body: JSON.stringify(o) });
