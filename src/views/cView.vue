<template>
    <template v-if="conf.type=='v-base'">
        <v-base :conf="conf" ref="vRef"></v-base>
    </template>
    <template v-else-if="conf.type=='v-list'">
        <v-list :conf="conf" ref="vRef"></v-list>
    </template>
    <template v-else-if="conf.type=='v-list-edit'">
        <v-list-edit :conf="conf" ref="vRef"></v-list-edit>
    </template>
    <template v-else-if="conf.type=='v-record'">
        <v-record :conf="conf" ref="vRef"></v-record>
    </template>
    <template v-else-if="conf.type=='v-view'">
        <v-record :conf="conf" ref="vRef"></v-record>
    </template>
    <template v-else-if="conf.type=='v-edit'">
        <v-record :conf="conf" ref="vRef"></v-record>
    </template>
    <template v-else-if="conf.type=='v-search'">
        <v-search :conf="conf" ref="vRef"></v-search>
    </template>
    <template v-else-if="conf.type=='v-insert'">
        <v-record :conf="conf" ref="vRef"></v-record>
    </template>
    <template v-else>
        <div>Views non riconosciuta {{conf.type}}</div>
    </template>
</template>

<script>
//import Server from "@/cupparis/lib/Server";
import CrudComponent from "../CrudComponent";
//import WrapperConf from "@/cupparis/views/WrapperConf";
import vBase from "./vBase";
import vList from "./vList";
import vListEdit from './vListEdit';
import vRecord from "./vRecord";
import vSearch from "./vSearch.vue";

export default {
    name : "cView",
    components: {vBase,vList,vListEdit,vRecord,vSearch},
    extends: CrudComponent,
    props : ['conf'],
    methods: {
        instance() {
            return this.$refs.vRef;
        }
    }
}
</script>

<style scoped>

</style>
