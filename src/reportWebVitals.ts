/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-22 15:32:33
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-22 18:03:16
 * @FilePath: \mindmap\src\reportWebVitals.ts
 */
import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({
      getCLS, getFID, getFCP, getLCP, getTTFB,
    }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
