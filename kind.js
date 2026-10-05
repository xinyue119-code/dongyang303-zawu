// 杂物间：衣服和鞋以外的东西都记在这里。index.html 里的程序和「化妆台」完全一样，区别都在这个文件。
window.KIND = {
  id: "zw",                  // 数据库集合前缀：zw_items / zw_photos
  name: "杂物间",
  unit: "件",
  house: true,               // 有地图、清单（记大概）、存货（记数量），收纳位置在这里增改
  expiry: true,              // 只记包装上的期限（药、电池之类），不算开封后几个月
  paoOpts: [],
  expLabel: "有效期",
  idleDays: 90,              // 开封后多少天没用，算「好久没用」
  colors: ["黑", "蓝", "红", "绿", "橙", "粉", "紫", "黄", "灰", "棕", "多色"],
  cats: [
    { g: "笔", items: [["中性笔/圆珠笔"], ["钢笔"], ["铅笔/自动铅笔"], ["荧光笔/马克笔"], ["替芯/墨水"]] },
    { g: "纸", items: [["本子"], ["手帐"], ["活页纸/便签"], ["便利贴/索引贴"]] },
    { g: "文具", items: [["橡皮/修正带"], ["尺/剪刀/刀"], ["胶水/胶带"], ["夹子/订书机"], ["文件夹/收纳"]] },
    { g: "电子", items: [["充电线/充电器"], ["电池"], ["耳机/小电器"], ["存储卡/U盘"]] },
    { g: "生活", items: [["药品"], ["卫生用品"], ["清洁用品"], ["厨房用品"], ["雨具/包袋"]] },
    { g: "其他", items: [["证件/文件"], ["印章/钥匙"], ["工具/五金"], ["纪念品"], ["其他"]] }
  ],
  // 2026-10-05 的位置调整，主人登录时跑一次（meta 里记了标记，跑过就不再跑）：
  // 长箱3 改成放杂物（里面登记的衣服回到东阳303的「待整理」）；睡衣筐交给东阳303放衣服；加一个冰箱。
  migrate: async db => {
    const flag = db.doc("meta/zawu-20261005");
    if ((await flag.get()).exists) return;
    const locs = (await db.collection("locations").get()).docs;
    const l3 = locs.find(d => d.id === "long3") || locs.find(d => d.data().code === "L3");
    if (l3) {
      for (const it of (await db.collection("items").where("loc", "==", l3.id).get()).docs) await it.ref.update({ loc: "" });
      await l3.ref.update({ modes: ["list"], kind: "", out: false, fill: "" });
    }
    const pj = locs.find(d => d.id === "pajama") || locs.find(d => d.data().name === "睡衣筐");
    if (pj) await pj.ref.update({ modes: ["item"], kind: "box", out: false, fill: "空" });
    if (!locs.some(d => d.id === "fridge")) await db.doc("locations/fridge").set({ name: "冰箱", code: "", spot: "fridge", modes: ["list"], kind: "", out: false, fill: "", note: "", contents: "", order: Date.now() });
    await flag.set({ done: Date.now() });
  },
  searchHint: "找东西：印章、驱蚊、充电线…",
  notePh: "比如：Sarasa 黑 / Type-C 充电线",
  shadeLabel: "规格",
  shadePh: "比如：0.38 / B5 方格 / 1m",
  photoHint: "同一种的拍一张就行，数量在下面填",
  emptyHint: "还没有拍照录入的东西。想逐件记的（文具、充电线、药…）点右下角「＋ 录入」拍一张。<br><br>柜子、抽屉、小盒子里的东西不用一件件拍：在「地图」里点开那个位置，写一段清单就行，写进去的都能在上面搜到。"
};
