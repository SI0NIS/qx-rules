// 波点音乐去广告（Quantumult X script-response-body）
// 只处理被动广告：开屏、首页广告模块、各类弹窗、banner、播放页广告
// 不动 advert/earning/**（看广告赚金币是用户主动功能）

const url = $request.url;
const EMPTY439 = '{"code":439,"data":{}}';
let body = $response.body;

function parse(b) {
  try { return JSON.parse(b); } catch (e) { return null; }
}

// 1) 无广告时官方就返回 {"code":439,"data":{}}，直接复用该格式
if (/\/api\/(service\/advert\/config|service\/banner\/positions|play\/advert\/info|rec\/feed)(?:\?|$)/.test(url)) {
  body = EMPTY439;
}
// 2) 弹窗类：保留响应外壳，仅清空 data，避免 App 解析异常
else if (/\/api\/(popup\/(mine|scene|start)\/info|service\/v2\/openscreen\/index|pay\/vip\/invitation\/(swell|assist)\/popup|service\/version\/popup)(?:\?|$)/.test(url)) {
  const o = parse(body);
  if (o) { o.data = {}; body = JSON.stringify(o); }
  else { body = EMPTY439; }
}
// 3) 首页模块列表：剔除 type=8「广告」模块，清空 bannerList
else if (/\/api\/service\/home\/index(?:\?|$)/.test(url)) {
  const o = parse(body);
  if (o && o.data) {
    if (Array.isArray(o.data.moduleList)) {
      o.data.moduleList = o.data.moduleList.filter(m => !(m && (m.type === 8 || m.name === '广告')));
    }
    if (Array.isArray(o.data.bannerList)) { o.data.bannerList = []; }
    body = JSON.stringify(o);
  }
}
// 4) 全局开关：关掉启动广告弹窗 / 广告引导 / 退出广告
else if (/\/api\/service\/conf\/all(?:\?|$)/.test(url)) {
  const o = parse(body);
  if (o && o.data) {
    const gs = o.data.groupSign;
    if (gs) {
      ['adStartAppDialog', 'adGuideTest', 'adExitChange'].forEach(k => {
        if (k in gs) { gs[k] = 0; }
      });
    }
    body = JSON.stringify(o);
  }
}

$done({ body });
