const state = {
    singer: {},
    user: {},
    token: null,
    title: '',
    source: [],
    selectid: [],
    results: [],
    dir: '/',
    sdir: '/',
    model_type_1: {"file_list":[],"time_list":[]},
    model_type_2: {"file_list":[],"time_list":[]},
    model_type_3: {"file_list":[],"time_list":[]},
    publish: '',
    timeList: [],
    timelist_cid: -1,
    current_temp_type: 1,
    select_model_id: -1,
    dragBoxs:[], //可拖拽编辑元素
    getAllDragBoxData: [], //获取所有当前可编辑元素的宽高位置类型等数据
    editEnable:'', //可编辑状态,
    showPosData: { x:0, y:0, w:0, y:0 }, // 拖拽坐标显示
    publishData: [] //可上线资源
};

export default state;