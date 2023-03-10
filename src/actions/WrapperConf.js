//import CrudCore from "@/cupparis/lib/CrudCore";

export default class WrapperConf {
    defaultConf =  {
        name : '',
        modelData:{},
        extraBind: {},
        controlType : 'button',
        _visible() {
            if (this.visible instanceof Function) {
                return this.visible.apply(this);
            }
            return this.visible;
        },
        _disable() {
            if (this.enabled instanceof Function) {
                return this.enabled.apply(this);
            }
            return this.enabled;
        },
        _execute() {
            if (this.execute) {
                return this.execute();
            }
            alert('execute non definita')
        },
    }

    loadConf(conf) {
        let that = this;
        for (let key in conf.actions) {
            console.log('key',key,conf.actions[key]);
            let na = Object.assign(that.defaultConf,conf.actions[key]);
            console.log('key1',key,na);
        }
        //console.log('------ ')
        return conf;
    }
}
