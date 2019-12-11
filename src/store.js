import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        type: 'prof',

        price_data: {
            table_price: false,
            table_price_vorot: false,
            table_price_kalitka: false,
            delivery: false,
        },
        min_length_zabor: 0,
        vysota: [],
        tip_pokrytiia: [],
        shirina_vorot: [],
        tolshchina: [],
        shosse: [],

        photo_modals: [], // фото модальное
        name: {}, // название хранится в calc/name.json
        table_price_hidden: false, //скрыть таблицу расчета

        showResult: false,
        // расчитать
        disabled: true,


        price: 0,
        price_dlina: 0,

        price_vorot: 0,
        total_vorot: 0,

        price_kalitok: 0,
        total_kalitok: 0,

        total_not_sales: 0,
        total_delivery: 0,

        start_sales: 0,
        sales_procent: 0,
        sales: 0,

        total: 0,

        // ошибки глобальные в расчете
        errorGlobal: {
            error1: false
        },
        // для конкретного вида забора
        actions: [],
        // все акции
        action_alls: [],

        first: false,

        image:'https://dostup-zabor.ru//wp-content/uploads/2019/01/profnastil-1-min.png'


    },
    mutations: {
        //устанавливаем тип
        setType(state, type) {
            if (state.type == type) {

            } else {
                state.type = type;
                state.showResult = false;

            }
        },
        // цена устанавливаем  и прочее
        addPrice(state, data) {

            state.price_data.table_price = data.price;
            state.price_data.table_price_vorot = data.table_price_vorot;
            state.price_data.table_price_kalitka = data.table_price_kalitka;
            state.price_data.delivery = data.delivery;

            state.min_length_zabor = parseInt(data.min_length_zabor);

            state.start_sales = parseInt(data.start_sales);
            state.sales_procent = parseInt(data.sales);
            // название
            state.name = {};
            if (data.name) {
                for (let k in data.name) {
                    Vue.set(state.name, k, data.name[k])
                }
            }
            //  акции для конкретного вида
            state.actions = [];
            if (data.actions) {
                data.actions.forEach(el => {
                    state.actions.push(el);
                })
            }
            // все акции
            state.action_alls = [];
            if (data.action_alls) {
                data.action_alls.forEach(el => {
                    state.action_alls.push(el);
                })
            }
            //фото для модалки
            state.photo_modals = [];

            state.price_data.table_price.forEach(el => {
                if (el.photo) {

                    state.photo_modals.push({
                        photo: el.photo,
                        title: el.tip_pokrytiia
                    })
                }
            })
            state.table_price_hidden = data.table_price_text_hidden;
        },
        //изображение
        addImage(state, image) {
            state.image = image;
        },
        //высоту забора
        addVysota(state, data) {
            state.vysota = data;
        },

        //тип покрытия
        addTippokrytiia(state, data) {
            state.tip_pokrytiia = data;
        },

        // ширина ворот
        addShirina_vorot(state, data) {
            if (typeof data == 'undefined') {
                state.shirina_vorot = [];
            } else {
                state.shirina_vorot = data;
            }
        },
        // толщина
        addTolshchina(state, data) {
            if (typeof data == 'undefined') {
                state.tolshchina = [];
            } else {
                state.tolshchina = data;
            }
        },
        // шоссе
        addShosse(state, data) {
            state.shosse = data;
        },

        // для кнопки расчитать
        setDisabled(state) {
            state.disabled = !state.disabled;
        },
        // акции
        setActions(state, model) {
            state.actions.forEach((el, k) => {
                // если ноль по длине
                if (el.dlina === "0") {

                } else {
                    //длина не ноль
                    let dlina = parseInt(el.dlina);
                    if (dlina <= parseInt(model.dlina)) {
                        //показуем
                        Vue.set(state.actions[k], 'disabled', false);
                    } else {
                        //скрываем
                        Vue.set(state.actions[k], 'disabled', true);
                    }

                }
                // проверить по типу
                let tip_pokrytiia = el.tip_pokrytiia;
                if (tip_pokrytiia !== "") {
                    if (model.tip_pokrytiia == tip_pokrytiia) {
                        //показуем
                        Vue.set(state.actions[k], 'disabled', false);
                    } else {
                        //скрываем
                        Vue.set(state.actions[k], 'disabled', true);
                    }
                }
            });
        },

        // расчет
        calc(state, data) {

            state.price = 0;
            state.price_dlina = 0;

            state.price_vorot = 0;
            state.total_vorot = 0;

            state.price_kalitok = 0;
            state.total_kalitok = 0;

            state.total_delivery = 0;

            state.total = 0;
            state.total_not_sales = 0;

            state.sales = 0;

            // для рябицы считаем по другому
            if (state.type == "setkarabica") {
                state.price_data.table_price.forEach(element => {
                    if (data.tip_pokrytiia == element.tip_pokrytiia && data.vysota == element.vysota) {
                        state.price = element.price;
                    }
                })

            } else {
                state.price_data.table_price.forEach(element => {
                    if (data.tip_pokrytiia == element.tip_pokrytiia) {
                        // костыль для толщины
                        let tolshchina = [];
                        element.data_item.forEach(item => {
                            tolshchina.push(item.tolshchina)
                            if (item.tolshchina == data.tolshchina && item.vysota == data.vysota) {
                                state.price = item.price;
                            }
                        })
                        // тут ловим ошибочку нет такой толщины
                        if (jQuery.inArray(data.tolshchina, tolshchina) == -1) {
                            state.errorGlobal.error1 = true;
                        } else {
                            state.errorGlobal.error1 = false;
                        }

                    }
                });
            }
            state.total_not_sales = state.total = state.price_dlina = parseInt(state.price) * parseInt(data.dlina);

            // ворота
            if (data.kol_vorot !== "" && data.shirina_vorot !== "") {
                state.price_data.table_price_vorot.forEach(element => {
                    if (element.shirina_vorot == data.shirina_vorot && data.vysota == element.vysota) {
                        state.price_vorot = parseInt(element.price);
                    }
                })
                state.total_vorot = parseInt(data.kol_vorot) * state.price_vorot;
                state.total_not_sales = state.total += state.total_vorot;
            }

            // калитки
            if (data.kol_kalitok !== "") {
                state.price_data.table_price_kalitka.forEach(element => {
                    if (data.vysota == element.vysota) {
                        state.price_kalitok = parseInt(element.price)
                    }
                })
                state.total_kalitok = parseInt(data.kol_kalitok) * state.price_kalitok;
                state.total_not_sales = state.total += state.total_kalitok;
            }

            // доставка
            if (data.shosse !== "" && data.distance !== "") {
                state.price_data.delivery.some(element => {
                    if (element.shosse == data.shosse && parseInt(data.distance) <= parseInt(element.расстояние)) {
                        state.total_delivery = parseInt(element.price);
                        return true;
                    }
                })
                state.total_not_sales = state.total += state.total_delivery;
            }

            // скидка
            if (state.type !== "setkarabica") {
                if (state.start_sales <= state.total) {
                    state.sales = (state.total * state.sales_procent) / 100;
                    state.total = state.total - state.sales;
                }
            }
            state.showResult = true;
        },

        setFirst(state) {
            state.first = true;
        },

        upDisabledFalse(state){
            state.disabled=false;
        },

        upDisabledTrue(state){
            state.disabled=true;
        }

    },
    actions: {

        //получить все значения
        getItems({
            commit,
            state
        }) {
            let formdata = new FormData();
            formdata.append("action", "getCalcItems");
            formdata.append("type", state.type);
            const options = {
                method: "POST",
                data: formdata,
                url: process.env.VUE_APP_ENV_URL
            };
            this.commit('upDisabledTrue');
            Vue.axios(options).then(response => {
                this.commit('addVysota', response.data.vysota);
                this.commit('addTippokrytiia', response.data.tip_pokrytiia);
                this.commit('addShirina_vorot', response.data.shirina_vorot);
                this.commit('addTolshchina', response.data.tolshchina);
                if (!state.first) {
                    this.commit('addShosse', response.data.shosse);
                    this.commit('setFirst');
                }
                this.commit('addPrice', response.data);
                this.commit('addImage', response.data.image);

                this.commit('upDisabledFalse');
            });


        },


    }
})