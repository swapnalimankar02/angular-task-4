import { Component,AfterViewInit, ElementRef, ViewChild,  } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { Chart, ChartConfiguration, registerables} from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements AfterViewInit  {
  @ViewChild('chartCanvas') chartCanvas:ElementRef<HTMLCanvasElement> | undefined;

  chartForm: FormGroup | any;
  val1 : number | null = null ;
  val2 : number | null = null ;
  chartVisible : boolean = false;
  validationMassage : string = '';
  chartInstance : Chart | undefined;
 

  constructor(){
    Chart.register(...registerables);

    this.chartForm = new FormGroup({
      val1 : new FormControl(null, [Validators.required, Validators.max(100)]),
      val2 : new FormControl(null, [Validators.required, Validators.max(100)])
    });    
  }
  ngAfterViewInit(): void{
    this.createChart();
  }
  calculateRemainingValue() : void{
    const val1 = this.chartForm.get('val1')?.value;
    const val2 = this.chartForm.get('val2')?.value;

    if(val1 > 100){
      this.validationMassage = 'Value can not exceed 100.';
      return;
    }

    if (val2 > 100){
      this.validationMassage = 'Value can not exceed 100.';
      return;
    }

    if (val1 && !val2){
      this.chartForm.patchValue({ val2: 100 - val1 });
    } else if (!val1 && val2){
      this.chartForm.patchValue({ val1: 100 - val2 });
    }
    this.validationMassage = '';
  }

  createChart(): void{
    if(this.val1 && this.val2 && (this.val1 + this.val2) <= 100 && this.chartCanvas){
      const ctx = this.chartCanvas.nativeElement.getContext('2d');

      if(!ctx){
        console.error('could not get canvas context.');
        return;
      }

      if(this.chartInstance){
        this.chartInstance.destroy();
      }

      const data = {
        labels: ['Box-1', 'Box-2'],
        datasets: [
          {
            data: [this.val1, this.val2], backgroundColor: ['red', 'green']
          }
        ]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 0.5
      };

      const chartConfig: ChartConfiguration = {
        type: 'pie',
        data,
        options
      };

      this.chartInstance = new Chart(ctx, chartConfig);
      this.chartVisible = true;
    }
  }
}
