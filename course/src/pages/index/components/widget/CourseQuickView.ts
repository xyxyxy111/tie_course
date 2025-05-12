
export class CourseQuickView {
  hoverFlag: boolean = false;

  constructor(public title: string, public text: string,
    public imgpath: string, public targetURL: string,
    price: number // 参数不直接声明为public
  ) {
    this.price = parseFloat(price.toFixed(2)); // 强制保留2位小数
  }

  mouseEnter() {
    this.hoverFlag = true;
  }

  mouseLeave() {
    this.hoverFlag = false;
  }
}