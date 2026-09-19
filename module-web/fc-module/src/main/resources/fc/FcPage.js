import Common from '@company/common-js-web';
import FcHomeController from './controller/FcHomeController.js';

const { PageRouter } = Common;

new PageRouter()
    .route('home', () => new FcHomeController().init())
    .start();
