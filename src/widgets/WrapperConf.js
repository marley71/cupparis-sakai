import CrudCore from "../lib/CrudCore";
import Server from "../lib/Server";

export default class WrapperConf {
    defaultConf =  {
        name : '',
        value: null,
        placeholder : '',
        extraBind: {},
        type : 'w-input',
        label : '',
    }

    loadConf(conf) {
        let that = this;
        //console.log('WIDGET CONF',conf);
        let dC = Object.assign({},this.defaultConf);
        conf.type = conf.type || that.defaultConf.type;
        let wName = CrudCore.camelCase(conf.type);
        //console.log('wName',wName)
        if (that[wName]) {
             conf = that[wName](conf);
        }
        conf = Object.assign(dC,conf);
        //console.log('WIDGET',conf);
        return conf;
    }

    wSelect(conf) {
        //console.log('conf',conf);
        let options = [];
        if (conf.domainValuesOrder) {
            for (let i in conf.domainValuesOrder) {
                let opt = {
                    id : conf.domainValuesOrder[i],
                    label : conf.domainValues[conf.domainValuesOrder[i]],
                }
                options.push(opt);
            }
        } else {
            for (let k in conf.domainValues) {
                let opt = {
                    id : k,
                    label : conf.domainValues[k],
                }
                options.push(opt);
            }
        }
        //console.log('options',options);
        conf.options = options;
        return conf;
    }

    wAutocomplete(conf) {
        conf.route = null;
        conf.suggestions = [];

        conf.search = conf.search || function (event) {
            let that = this;
            if (!that.route) {
                that.route = that.createRoute('autocomplete');
                that.route.setValuesFromObj(that);
            }
            that.route.setParams({
                field : that.name,
                value : event.query,
            });

            console.log('route',that.route,that);
            that.Server.route(that.route,function (json) {
                console.log('json',json)
                that.suggestions = json.result;
            })
            console.log('search',conf,event);
        }
        return conf;
    }

    wCheckbox(conf) {
        conf.layout = 'row';
        return conf;
    }

    wRadio(conf) {
        conf.layout = 'row';
        return conf;
    }
    wDateText(conf) {
        conf.displayFormat = 'DD/MM/YYYY';
        conf.dateFormat = 'yyyy-mm-dd';
        conf.formattedValue = null;
        conf.invalidDateString ='app.data-non-valida';
        return conf;
    }
    wMultiSelect(conf) {
        let value = conf.value || [];
        if (!Array.isArray(value))
            value = [value];
        let selectedValue = value.length > 0 ? [] : null;
        let dV = conf.domainValues || {};
        let dVO = conf.domainValuesOrder || Object.keys(dV);
        let options = [];
        for (var i in dVO) {
            options.push({
                code : ""+dVO[i],
                name : dV[dVO[i]],
            })
        }
        if (value) {
            for (let i in value) {
                value[i] = ""+value[i];
            }
        }
        for (let i in value) {
            selectedValue.push(
                {
                    code : value[i],
                    name : dV[value[i]],
                }
            )
        }
        conf.selectedValue = value;
        conf.defaultValue = [];
        conf.options = options;
        conf.filter = false;
        return conf;
    }
    wSwap(conf) {
        conf = Object.assign({
            activeIcon: 'fa-check',
            routeName: 'set',
            title: 'swap',
            bgInactive: '#FF0000',
            bgActive: 'bg-red-400',
            domainValues: {
                0: 'app.no',
                1: 'app.si'
            },
            slot: '',
            toggleActive: false,
            switchClass: 'form-switch-success',
            dataSwitched: false,
            isAjax:true,  // se e' un controllo che deve fare la chiamata di update altrimenti e' un controllo normale in una form
            json : null, // ultimo json caricato dalla chiamata ajax,
            currentIndex : 0,  // indice corrente delle chiavi di domainValues
        },conf);
        //console.log('SWAP',conf);
        return conf;
    }

    wStatus(conf) {
        if (!("domainValues" in conf)) {
            conf.domainValues = {
                0: 'app.no',
                1: 'app.si'
            };
        }
        if (! ("value" in conf) ){
            conf.value = Object.keys(conf.domainValues)[0];
        }
        conf.currentValue = conf.domainValues[conf.value];
        return conf;
    }

    wTexthtml(conf) {
        if (!("toolbar" in conf)) {
            conf.toolbar = null;
        }
        return conf;
    }

    wUpload(conf) {
        conf.files = null;
        if (!conf.uploadFile) {
            conf.uploadFile = function(event) {
                this.files = event.files;
                console.log('uploadevent',event,this);
            }
            conf.getValue = function () {
                return this.value;
            }
            conf.getFileValue = function () {
                return this.files;
            }
        }
        return conf;
    }
    wUploadAjax(conf) {
        conf = this.wUpload(conf);
        conf.routeName = 'uploadfile';
        if (!conf.setRouteValues) {
            conf.setRouteValues =  function (route) {
                route.setValues({
                    modelName: this.modelName
                })
                return route;
            }
        }
        if (!conf.onSuccess) {
            conf.onSuccess = function () {
                console.log('onSuccess',this.value);
            }
        }
        if (!conf.onError) {
            conf.onError = function () {
                console.log('onError',this.value);
            }
        }

        conf.uploadFile = function(event) {
            this.files = event.files;
            this.sendAjax();
        }
        conf.sendAjax =  function () {
            var that = this;
            var fDesc = that.getFileValue();
            if (!fDesc || !fDesc[0])
                throw 'descrittore file upload non valido';
            fDesc = fDesc[0];
            // var fileName = fDesc.filename;
            var route = that.createRoute(that.routeName);
            that.setRouteValues(route);
            that.error = false;
            that.complete = false;

            var realUrl = Server.getUrl(route.getUrl());
            console.log('realurl', route.getUrl())
            var fdata = new FormData();
            //data.append('file',jQuery(that.$el).find('[c-image-file]').prop('files')[0]);
            fdata.append('file', fDesc)
            console.log('ajaxFields', that.ajaxFields)
            for (var k in that.ajaxFields)
                fdata.append(k, that.ajaxFields[k])
            // TODO inserire axios
            window.jQuery.ajax({
                url: realUrl,
                headers: Server.getHearders(),
                type: 'POST',
                data: fdata,
                processData: false,
                contentType: false                    // Using FormData, no need to process data.
            }).done(function (data) {
                that.error = data.error;
                that.lastUpload = null;
                that.json = data;
                console.log("Success: Files sent!", data);
                if (data.error) {
                    var msg = null;
                    try {
                        var tmp = JSON.parse(data.msg);
                        msg = "";
                        for (k in tmp) {
                            msg += tmp[k] + '\n';
                        }
                    } catch (e) {
                        msg = data.msg;
                    }
                    that.errorMessage = msg;
                    //self._showError(dialog,msg);
                    window.jQuery(that.$el).find('[crud-button="ok"]').addClass("disabled");
                    that.value =  JSON.stringify({});
                    return;
                }
                that.$emit('success', that);
                that.complete = true;

                console.log('done, data.result', data.result);

                that.lastUpload = Object.assign({},data.result);
                // TODO sfruttare meglio l'oggetto upload primeface
                that.value = JSON.stringify(data.result); //.replace(/\\"/g, '"');
                //that.$refs.preview.setValue(data.result);
                that.onSuccess();
            }).fail(function (data, error, msg) {
                console.log("An error occurred, the files couldn't be sent!");
                that.lastUpload = false;
                that.error = true;
                that.errorMessage = "Upload error " + data + " " + error + " " + msg;
                that.value = JSON.stringify({});
                that.onError();
            });
        };
        return conf;
    }
}
