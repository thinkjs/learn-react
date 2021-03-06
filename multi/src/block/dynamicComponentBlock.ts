import * as Ndoo from 'ndoojs';
import use from '../library/use';


import ReduxService from '../service/reduxService';
import Util from '../service/utilService';
use(ReduxService, Util);

import * as Component from '../component';

let ndoo = Ndoo;

@Ndoo.Component('block.dynamicComponentBlock', Ndoo.RegType.Block, true)
export default class DynamicComponentBlock {
  static init(elem: HTMLElement, rawParam: string) {
    let { componentName, dataLabel } = Util.formatUrlParam(rawParam);
    let label = (<string>dataLabel).replace('[id]', ndoo.getPk());
    Component[`${componentName}Load`]().then((componentHandle: any) => {
      let reduxService = ndoo.service<ReduxService>('common.reduxService');
      let store = reduxService.addReducer(label, componentHandle[`${<string>componentName}Reducer`](label));
      if (componentHandle[`${<string>componentName}Saga`]) {
        reduxService.addSaga(componentHandle[`${<string>componentName}Saga`](label));
      }
      Component.render(elem, componentHandle[<string>componentName], store, label);
    });
  }
}