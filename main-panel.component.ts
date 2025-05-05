import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import { OilReportComponent } from '../maps/oil-report/oil-report.component';
import { AtmTransactionComponent } from '../atm-transaction/atm-transaction.component';
import { TransactionReportComponent } from '../atm-transaction/transaction-report/transaction-report.component';
import { KharchReportComponent } from '../kharch/kharch-report/kharch-report.component';
import { JamaBakiReportComponent } from '../jama-baki/jama-baki-report/jama-baki-report.component';
import { PurchaseReportComponent } from '../table-list/purchase-report/purchase-report.component';
import { DipStockComponent } from '../dip-stock/dip-stock.component';
import { DipStockReportComponent } from '../dip-stock/dip-stock-report/dip-stock-report.component';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss']
})
export class MainPanelComponent implements OnInit {

  reportDate:any; 
  userId = localStorage.getItem('userId');

  currentTime: string = '';
  petrolPumps: any[] = [];
  dieselPumps: any[] = [];

  petrolTotalLTR: number = 0;
  dieselTotalLTR: number = 0;

  petrolTotalRS: number = 0;
  dieselTotalRS: number = 0;

  totalRs: number = 0;
  oilsellTotal: number = 0;
  ATMTotal:number = 0;
  kharchTotal:number = 0;
  jamaTotal:number = 0;
  bakiTotal:number = 0;

  
  petrolPurchaseLTR: number = 0;
  dieselPurchaseLTR: number = 0;
  Total_Case: number = 0;

  Petrol_Ugadto_Stock: number = 0;
  Diesel_Ugadto_Stock: number = 0;

  constructor(private dialog: MatDialog,private use:UserServiceService) {}
  
 

  showSelectedDate() {
    const formatted = this.use.getFormattedDate(this.reportDate);
    console.log('Formatted Date:', formatted);
    this.getUgadtoStock(formatted, this.userId);
  }
  
  ngOnInit() {
    this.petrolPumps = [
      { name: 'Petrol Pump 1', openingMeter: 0, closingMeter: 0, saleLtr: 0, testing: 0, ltr: 0, rate: 0,total_rs:0 },
      { name: 'Petrol Pump 2', openingMeter: 0, closingMeter: 0, saleLtr: 0, testing: 0, ltr: 0, rate: 0,total_rs:0 },
      { name: 'Petrol Pump 3', openingMeter: 0, closingMeter: 0, saleLtr: 0, testing: 0, ltr: 0, rate: 0,total_rs:0 },
      { name: 'Petrol Pump 4', openingMeter: 0, closingMeter: 0, saleLtr: 0, testing: 0, ltr: 0, rate: 0,total_rs:0 },
      { name: 'Petrol Pump 5', openingMeter: 0, closingMeter: 0, saleLtr: 0, testing: 0, ltr: 0, rate: 0,total_rs:0 }
    ];

    this.dieselPumps = [
      { name: 'Diesel Pump 1', openingMeter: 0, closingMeter: 0, saleLtr: 0, testing: 0, ltr: 0, rate: 0,total_rs:0 },
      { name: 'Diesel Pump 2', openingMeter: 0, closingMeter: 0, saleLtr: 0, testing: 0, ltr: 0, rate: 0,total_rs:0 },
      { name: 'Diesel Pump 3', openingMeter: 0, closingMeter: 0, saleLtr: 0, testing: 0, ltr: 0, rate: 0,total_rs:0 },
      { name: 'Diesel Pump 4', openingMeter: 0, closingMeter: 0, saleLtr: 0, testing: 0, ltr: 0, rate: 0,total_rs:0 },
      { name: 'Diesel Pump 5', openingMeter: 0, closingMeter: 0, saleLtr: 0, testing: 0, ltr: 0, rate: 0,total_rs:0 }
    ];
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }

  calculatePetrol(index: number) {
  const petrol = this.petrolPumps[index];
  const total = (petrol.closingMeter || 0) - (petrol.openingMeter || 0);
  const testing = petrol.testing || 0;
  const rate = petrol.rate || 0;
  petrol.saleLtr=total;
  petrol.ltr = total - testing;
  petrol.total_rs = petrol.ltr * rate;

  // Update Totals
  this.petrolTotalLTR = this.petrolPumps.reduce((sum, p) => sum + (p.ltr || 0), 0);
  this.petrolTotalRS = this.petrolPumps.reduce((sum, p) => sum + (p.total_rs || 0), 0);
  this.updateTotalRs();
}

calculateDiesel(index: number) {
  const diesel = this.dieselPumps[index];
  const total = (diesel.closingMeter || 0) - (diesel.openingMeter || 0);
  const testing = diesel.testing || 0;
  const rate = diesel.rate || 0;
  diesel.saleLtr = total;
  diesel.ltr = total - testing;
  diesel.total_rs = diesel.ltr * rate;

  // Update Totals
  this.dieselTotalLTR = this.dieselPumps.reduce((sum, d) => sum + (d.ltr || 0), 0);
  this.dieselTotalRS = this.dieselPumps.reduce((sum, d) => sum + (d.total_rs || 0), 0);
  this.updateTotalRs();
}


updateTotalRs() {
  this.petrolTotalRS = this.petrolPumps.reduce((sum, p) => sum + (p.total_rs || 0), 0);
  this.dieselTotalRS = this.dieselPumps.reduce((sum, d) => sum + (d.total_rs || 0), 0);

  this.totalRs = this.petrolTotalRS + this.dieselTotalRS;
}


openOilsellBakComponent(): void {
  const dialogRef =this.dialog.open(OilReportComponent, {
    width: '60%',
    height: '70%',
    data: { date: this.use.getFormattedDate(this.reportDate)}
  });
  dialogRef.afterClosed().subscribe(result => {
    this.use.getOillsellList(this.use.getFormattedDate(this.reportDate), this.userId).subscribe(
      data => {
        this.oilsellTotal=data[0];
      }
    );
  });
}

openAtmBakComponent(){
  const dialogRef= this.dialog.open(TransactionReportComponent, {
    width: '60%',
    height: '70%',
    data: { date: this.use.getFormattedDate(this.reportDate)}
  });
  dialogRef.afterClosed().subscribe(result => {
    this.use.getTransactionList(this.use.getFormattedDate(this.reportDate), this.userId).subscribe(
      data => {
        this.ATMTotal=data[0];
      }
    );
  });
}

openKharchComponent(){
  const dialogRef=this.dialog.open(KharchReportComponent, {
    width: '60%',
    height: '70%',
    data: { date: this.use.getFormattedDate(this.reportDate)}
  });
  dialogRef.afterClosed().subscribe(result => {
    this.use.getKharchList(this.use.getFormattedDate(this.reportDate), this.userId).subscribe(
      data => {
        this.kharchTotal=data[0];
      }
    );
  });
}
openJamaBakiComponent(){
  const dialogRef=this.dialog.open(JamaBakiReportComponent, {
    width: '60%',
    height: '70%',
    data: { date: this.use.getFormattedDate(this.reportDate)}
  });
  dialogRef.afterClosed().subscribe(result => {
    this.use.getJamaBakiList(this.use.getFormattedDate(this.reportDate), this.userId).subscribe(
      data => {
        this.jamaTotal = data[0][0];
        this.bakiTotal = data[0][1];
      }
    );
  });
}

getUgadtoStock(date:string,userId:string) {
  this.use.getOneDayAgoStock(date, userId).subscribe(
    data => {
      this.Petrol_Ugadto_Stock=data.petrol;
      this.Diesel_Ugadto_Stock=data.diesel;
    },
    error => {
      console.error('Error fetching stock data', error);
    }
  );
}

openPurchase(data?: any): void {
  this.dialog.open(PurchaseReportComponent, {
    width: '70%',
    data: data || {} 
  });
}

dipstock(){
  this.dialog.open(DipStockReportComponent, {
    width: '60%',
    height: '70%',
    data: { oilsellTotal: this.oilsellTotal }
  });
}


Submit() {
  const petrolInputData = this.petrolPumps
    .filter(p => !(p.openingMeter === 0 && p.closingMeter === 0 && p.testing === 0 && p.rate === 0))
    .map(p => ({
      name: p.name,
      openingMeter: p.openingMeter,
      closingMeter: p.closingMeter,
      testing: p.testing,
      rate: p.rate
    }));

  const dieselInputData = this.dieselPumps
    .filter(d => !(d.openingMeter === 0 && d.closingMeter === 0 && d.testing === 0 && d.rate === 0))
    .map(d => ({
      name: d.name,
      openingMeter: d.openingMeter,
      closingMeter: d.closingMeter,
      testing: d.testing,
      rate: d.rate
    }));

  console.log('Petrol Input Data:', petrolInputData);
  console.log('Diesel Input Data:', dieselInputData);
}

}
