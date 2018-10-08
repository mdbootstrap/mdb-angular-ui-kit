import { Component } from '@angular/core';

@Component({
  selector: 'app-dounghnut',
  templateUrl: './dounghnut.component.html',
  styleUrls: ['./dounghnut.component.scss']
})
export class DounghnutComponent {

  public chartType: string = 'doughnut';

  public chartData: Array<any> = [300, 50, 100, 40, 120];

  public chartLabels: Array<any> = ['Red', 'Green', 'Yellow', 'Grey', 'Dark Grey'];

  public chartColors: Array<any> = [{
    hoverBorderColor: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)'],
    hoverBorderWidth: 0,
    backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
    hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
  }];

  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(): void { }
  public chartHovered(): void { }

}
