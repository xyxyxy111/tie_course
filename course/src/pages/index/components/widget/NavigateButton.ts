
export class NavigationButton {
  activeFlag: boolean = false;
  hoverFlag: boolean = false;
  
  constructor(public text: string) { }

  mouseEnter() {
    this.hoverFlag = true;
  }

  mouseLeave() {
    this.hoverFlag = false;
  }
}