<template>
    <button class="p-button p-button-icon p-1 p-button-text" v-if="controlType=='button' && _visible()" type="button"
            :title="translate(title)" :class="css" v-on:click="_execute()" v-bind:disabled="_disabled()" >
        <i class="m-1" v-show="icon" :class="icon"></i>
        <span>{{ translate(text) }}</span>
    </button>
    <a v-else-if="controlType=='link' && _visible()" class="p-button p-button-outlined" :target="target" :href="href"
       :title="translate(title)" :class="css" :disabled="_disabled()">
        <i class="m-1" v-show="icon" :class="icon"></i>
        <span>{{ translate(text) }}</span>
    </a>
    <div v-else>
        <b>{{key}}</b>{{controlType}}
    </div>
</template>

<script>
import CrudComponent from "../CrudComponent.vue";
import Server from "../lib/Server";
import WrapperConf from "./WrapperConf";

export default {
    name: "aBase",
    extends : CrudComponent,
    props: ['conf'],
    created() {
        let that = this;
        //console.log('CREATEDDD',that)
        that.overwriteMethods = {};
        var __call = function (lk) {
            that[lk] = function () {
                var localk = new String(lk);
                return that.overwriteMethods[localk].apply(that, arguments);
            }
        }

        for (let k in that.wConf) {
            //console.log('k',k,ext[k]);

            if (that.wConf[k] instanceof Function) {
                //console.log('found method',k);
                that.overwriteMethods[k] = that.wConf[k];
                __call(k);
            }
        }
        this.Server = Server;
    },
    data() {
        let that = this;
        let wc = new WrapperConf();
        let ext = wc.loadConf(that.conf);
        let dt = {};
        for (let k in ext) {
            if (!(ext[k] instanceof Function) ) {
                dt[k] = ext[k];
            }
        }
        dt.wConf = ext;
        //console.log('widget finalData',dt);
        return dt;
    },
    methods: {
        _visible() {
            //console.log('_visible',this.visible);
            if (this.visible instanceof Function) {
                return this.visible.apply(this);
            }
            return this.visible;
        },
        _disabled() {
            //console.log('_disable',this.enabled);
            if (this.enabled instanceof Function) {
                return !this.enabled.apply(this);
            }
            return !this.enabled;
        },
        _execute() {
            if (this.execute) {
                return this.execute();
            }
            alert('execute non definita')
        },
        setEnabled(value) {
            this.enabled = value;
        }
    }
}
</script>

<style scoped>

</style>
