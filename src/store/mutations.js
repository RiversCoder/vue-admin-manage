import * as types from './mutation-types.js'

const mutations = {
    [types.LOGIN]: (state, data) => {
        localStorage.token = data;
        state.token = data;
    },
    [types.LOGOUT]: (state) => {
        localStorage.removeItem('token');
        state.token = null;
    },
    [types.SINGER]: (state,data) => {
        state.singer = data;
    },
    [types.SOURCE]: (state,data) => {
        state.source = data;
    },
    [types.SELECT]: (state,data) => {
        state.selectid = data;
    },
    [types.RESULTS]: (state,data) => {
        state.results = data;
    },
    [types.DIR]: (state,data) => {
        state.dir = data;
    },
    [types.SDIR]: (state,data) => {
        state.sdir = data;
    },
    [types.MODEL_TYPE_1]: (state,data) => {
        state.model_type_1 = data;
    },
    [types.MODEL_TYPE_2]: (state,data) => {
        state.model_type_2 = data;
    },
    [types.MODEL_TYPE_3]: (state,data) => {
        state.model_type_3 = data;
    },
    [types.PUBLISH]: (state,data) => {
        state.publish = data;
    },
    [types.TIME_LIST]: (state,data) => {
        state.timeList = data;
    },
    [types.CURRENT_TIME_LIST_INDEX]: (state,data)=>{
        state.timelist_cid = data;
    },
    [types.CURRENT_TEMP_TYPE]: (state,value)=>{
        state.current_temp_type = value;
    },
    [types.SELECT_MODEL_ID]: (state,id) => {
        state.select_model_id = id;
    },
    [types.SET_DRAG_BOXS]: (state,arr) => {
        state.dragBoxs = arr;
    },
    [types.SET_DRAG_DATAS]: (state,arr) => {
        state.getAllDragBoxData = arr;
    },
    [types.SET_EDIT_ENABLE]: (state,onoff) => {
        state.editEnable = onoff;
    },
    [types.SET_POS_WIDTH]: (state,value) =>{
        state.showPosData = value;
    },
    [types.SET_PUBLISH_DATA]: (state,arr) =>{
        state.publishData = arr;
    }
};

export default mutations;