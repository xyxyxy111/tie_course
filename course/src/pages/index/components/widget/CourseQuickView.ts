import { Course } from '@/types/types.ts';
export class CourseQuickView extends Course{
  hoverFlag: boolean = false;
  
  constructor(
    public coverImgUrl : string,
    public title: string,
    public score: number,
    public originalPrice: number,
    public upDateTime: Date,
    public totalMinutes:number,
    public description: string,
    public whatYouWillLearn: string
  ) {
    super();
    // this.price = parseFloat(price.toFixed(2)); 
  }

  mouseEnter() {
    this.hoverFlag = true;
  }

  mouseLeave() {
    this.hoverFlag = false;
  }
}