import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import { OilReportComponent } from '../maps/oil-report/oil-report.component';
import { TransactionReportComponent } from '../atm-transaction/transaction-report/transaction-report.component';
import { KharchReportComponent } from '../kharch/kharch-report/kharch-report.component';
import { JamaBakiReportComponent } from '../jama-baki/jama-baki-report/jama-baki-report.component';
import { PurchaseReportComponent } from '../table-list/purchase-report/purchase-report.component';
import { DipStockReportComponent } from '../dip-stock/dip-stock-report/dip-stock-report.component';
import { NotificationService } from 'app/services/notification.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BackPageComponent } from '../back-page/back-page.component';
import { API_BACKPAGE } from 'app/serviceult';
import { HttpClient } from '@angular/common/http';


interface BackPageResponse {
  purchaseSellSummary: any;
  petrolSellSummary: any;
  dieselSellSummary: any;
  oilSellSummary: any;
  kharchSellSummary: [string, string][];
  transactionSellSummary: [string, string][];
  jamaSummary: [string, number][];
  bakiSummary: [string, number][];
}


@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss']
})
export class MainPanelComponent implements OnInit {

  kharchSellSummary: any[];
  transactionSellSummary: any[];
  jamaSummary: [string, number][] = [];
  bakiSummary: [string, number][] = [];
  firstTableData: [string, number][] = [];
  secondTableData: [string, number][] = [];

  reportDate: any; 
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

  petolQuantity : number = 0;
  dieselQuantity: number = 0;

  Petrol_dip : number = 0;
  Petrol_stock: number = 0;
  Diesel_dip : number = 0;
  Diesel_stock: number = 0;

  Total_petrol_stock: number = 0;
  Total_diesel_stock: number = 0;

  Total_Petrol: number = 0;
  Total_Diesel: number = 0;

  PumpName : string = '';
  multipliers = {
    twothousand: null,
    fivehundred: null,
    twohundred: null,
    onehundred: null,
    fifty: null,
    twenty: null,
    ten: null
  };

  twothousand = 0;
  fivehundred = 0;
  twohundred =  0;
  onehundred = 0;
  fifty = 0;
  twenty = 0;
  ten = 0;
  totalCaseCase = 0;
  note : String = '';

  constructor(private dialog: MatDialog,private use:UserServiceService,
    private notificationService:NotificationService, private http: HttpClient
  ) {}

  showSelectedDate() {
    const formatted = this.use.getFormattedDate(this.reportDate);
    console.log('Formatted Date:', formatted);
    this.getUgadtoStock(formatted, this.userId);
    this.getPetrolStock(formatted, this.userId);
    this.getDieselStock(formatted, this.userId);
    this.getoillist();
    this.getTransactionlist();
    this.getKharchlist();
    this.getJamaBakilist();
    this.getPurchaselist();
    this.getDiplist();
    this.getMoneyDetailsList();
    this.backPage();
  }
  

  ngOnInit() {
    this.getUserName();
    this.petrolPumps = [
      { name: 'Petrol Pump 1', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null,total_rs:0 },
      { name: 'Petrol Pump 2', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null,total_rs:0 },
      { name: 'Petrol Pump 3', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null,total_rs:0 },
      { name: 'Petrol Pump 4', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null,total_rs:0 },
      { name: 'Petrol Pump 5', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null,total_rs:0 }
    ];

    this.dieselPumps = [
      { name: 'Diesel Pump 1', openingMeter: null, closingMeter: null, saleLtr:0, testing: null, ltr: 0, rate: null,total_rs:0 },
      { name: 'Diesel Pump 2', openingMeter: null, closingMeter: null, saleLtr:0, testing: null, ltr: 0, rate: null,total_rs:0 },
      { name: 'Diesel Pump 3', openingMeter: null, closingMeter: null, saleLtr:0, testing: null, ltr: 0, rate: null,total_rs:0 },
      { name: 'Diesel Pump 4', openingMeter: null, closingMeter: null, saleLtr:0, testing: null, ltr: 0, rate: null,total_rs:0 },
      { name: 'Diesel Pump 5', openingMeter: null, closingMeter: null, saleLtr:0, testing: null, ltr: 0, rate: null,total_rs:0 }
    ];
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }
  
  getUserName(){
    this.use.getUserName(this.userId).subscribe(
      data => {
        this.PumpName =data.message;
      }
    );
  }

  getPetrolStock(date: string, userId: string) {
    this.use.getPetrolList(date, userId).subscribe((data: any[]) => {
      this.petrolPumps.forEach(pump => {
        pump.openingMeter = null;
        pump.closingMeter = null;
        pump.saleLtr = 0;
        pump.testing = null;
        pump.ltr = 0;
        pump.rate = null;
        pump.total_rs = 0;
      });
  
      data.forEach((item: any) => {
        const pump = this.petrolPumps.find(p => p.name === item.pump);
        if (pump) {
          pump.openingMeter = +item.open_meter;
          pump.closingMeter = +item.close_meter;
          pump.testing = +item.testing;
          pump.saleLtr = +item.petrol_ltr;
          pump.rate = +item.rate; 
          pump.ltr = +item.total; 
          pump.total_rs = +item.total_sell;    
        }
      });
      this.calculateTotals();
    });
  }
  
  getDieselStock(date: string, userId: string) {
    this.use.getDieselList(date, userId).subscribe((data: any[]) => {
      console.log('Diesel Data:', data);
  
      // Reset dieselPumps array before mapping new data
      this.dieselPumps.forEach(pump => {
        pump.openingMeter = null;
        pump.closingMeter = null;
        pump.saleLtr = 0;
        pump.testing = null;
        pump.ltr = 0;
        pump.rate =null;
        pump.total_rs = 0;
      });
  
      // Map the response data to dieselPumps based on pump name
      data.forEach((item: any) => {
        const pump = this.dieselPumps.find(p => p.name === item.pump);
        if (pump) {
          pump.openingMeter = +item.open_meter;
          pump.closingMeter = +item.close_meter;
          pump.testing = +item.testing;
          pump.saleLtr = +item.diesel_ltr ;
          pump.rate = +item.rate; 
          pump.ltr = +item.total; 
          pump.total_rs = +item.total_sell;
        }
      });
      this.calculateTotals();
    });
  }

  calculateTotals() {
    this.petrolTotalLTR = this.petrolPumps.reduce((sum, p) => sum + p.ltr, 0);
    this.petrolTotalRS = this.petrolPumps.reduce((sum, p) => sum + p.total_rs, 0);
  
    this.dieselTotalLTR = this.dieselPumps.reduce((sum, p) => sum + p.ltr, 0);
    this.dieselTotalRS = this.dieselPumps.reduce((sum, p) => sum + p.total_rs, 0);
    this.totalRs = this.petrolTotalRS + this.dieselTotalRS;
  }
  

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }

  getAbs(value: number): number {
    return Math.abs(value || 0);
  }
  

  calculatePetrol(index: number) {
  const petrol = this.petrolPumps[index];
  const total = (petrol.closingMeter || 0) - (petrol.openingMeter || 0);
  const testing = petrol.testing || 0;
  const rate = petrol.rate || 0;
  petrol.saleLtr = Math.abs(total);
  petrol.ltr = total - testing;
  petrol.total_rs = Math.abs(petrol.ltr * rate);

  // Update Totals
  this.petrolTotalLTR = this.petrolPumps.reduce((sum, p) => sum + Math.abs(p.ltr || 0), 0);
  this.petrolTotalRS = this.petrolPumps.reduce((sum, p) => sum + Math.abs(p.total_rs || 0), 0);

  this.updateTotalRs();
}

calculateDiesel(index: number) {
  const diesel = this.dieselPumps[index];
  const total = (diesel.closingMeter || 0) - (diesel.openingMeter || 0);
  const testing = diesel.testing || 0;
  const rate = diesel.rate || 0;
  diesel.saleLtr = Math.abs(total);
  diesel.ltr = total - testing;
  diesel.total_rs = Math.abs(diesel.ltr * rate);

  // Update Totals
  this.dieselTotalLTR = this.dieselPumps.reduce((sum, d) => sum + Math.abs(d.ltr || 0), 0);
  this.dieselTotalRS = this.dieselPumps.reduce((sum, d) => sum + Math.abs (d.total_rs || 0), 0);
  this.updateTotalRs();
}


updateTotalRs() {
  this.petrolTotalRS = this.petrolPumps.reduce((sum, p) => sum + (p.total_rs || 0), 0);
  this.dieselTotalRS = this.dieselPumps.reduce((sum, d) => sum + (d.total_rs || 0), 0);
  this.totalRs = this.petrolTotalRS + this.dieselTotalRS;
}

openOilsellBakComponent(): void {
  const formattedDate = this.use.getFormattedDate(this.reportDate);
  if (this.reportDate) {
    const dialogRef = this.dialog.open(OilReportComponent, {
      width: '60%',
      height: '70%',
      data: { date: formattedDate }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getoillist();
    });
  } else {
    this.notificationService.failure("Select the Date ?");
  }
}

getoillist(){
  const formattedDate = this.use.getFormattedDate(this.reportDate);
  this.use.getOillsellList(formattedDate, this.userId).subscribe(
    (data) => {
      if (data && data.length > 0) {
        this.oilsellTotal = data[0] ?? 0;
      } else {
        this.oilsellTotal = 0;
      }
    },
    (error) => {
      this.notificationService.failure("Failed to fetch oil sell data.");
    }
  );
}



openAtmBakComponent(){
  const dialogRef= this.dialog.open(TransactionReportComponent, {
    width: '60%',
    height: '70%',
    data: { date: this.use.getFormattedDate(this.reportDate)}
  });
  dialogRef.afterClosed().subscribe(result => {
    this.getTransactionlist();
    this.backPage();
  });
}

getTransactionlist(){
  const formattedDate = this.use.getFormattedDate(this.reportDate);
  this.use.getTransactionList(formattedDate, this.userId).subscribe(
    (data) => {
      if (data && data.length > 0) {
        this.ATMTotal = data[0] ?? 0;
      } else {
        this.ATMTotal = 0;
      }
    },
    (error) => {
      this.notificationService.failure("Failed to fetch Transaction sell data.");
    }
  );
}

openKharchComponent(){
  const dialogRef=this.dialog.open(KharchReportComponent, {
    width: '60%',
    height: '70%',
    data: { date: this.use.getFormattedDate(this.reportDate)}
  });
  dialogRef.afterClosed().subscribe(result => {
    this.getKharchlist();
    this.backPage();
    // this.use.getKharchList(this.use.getFormattedDate(this.reportDate), this.userId).subscribe(
    //   data => {
    //     this.kharchTotal=data[0];
    //   }
    // );
  });
}

getKharchlist(){
  const formattedDate = this.use.getFormattedDate(this.reportDate);
  this.use.getKharchList(formattedDate, this.userId).subscribe(
    (data) => {
      if (data && data.length > 0) {
        this.kharchTotal = data[0] ?? 0;
      } else {
        this.kharchTotal = 0;
      }
    },
    (error) => {
      this.notificationService.failure("Failed to fetch Kharch data.");
    }
  );
}

openJamaBakiComponent(){
  const dialogRef=this.dialog.open(JamaBakiReportComponent, {
    width: '60%',
    height: '70%',
    data: { date: this.use.getFormattedDate(this.reportDate)}
  });
  dialogRef.afterClosed().subscribe(result => {
    this.getJamaBakilist();
    this.backPage();
    // this.use.getJamaBakiList(this.use.getFormattedDate(this.reportDate), this.userId).subscribe(
    //   data => {
    //     this.jamaTotal = data[0][0];
    //     this.bakiTotal = data[0][1];
    //   }
    // );
  });
}

getJamaBakilist(){
  const formattedDate = this.use.getFormattedDate(this.reportDate);
  this.use.getJamaBakiList(formattedDate, this.userId).subscribe(
    (data) => {
      if (data && data.length > 0) {
        this.jamaTotal = data[0][0] ?? 0;
        this.bakiTotal = data[0][1] ?? 0;
      } else {
        this.jamaTotal = 0;
        this.bakiTotal = 0;
      }
    },
    (error) => {
      this.notificationService.failure("Failed to fetch Jama&Baki data.");
    }
  );
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
  const dialogRef=this.dialog.open(PurchaseReportComponent, {
    width: '70%',
    data: { date: this.use.getFormattedDate(this.reportDate)}
  });
  dialogRef.afterClosed().subscribe(result => {
    this.getPurchaselist();
    // this.use.getPurchaseiList(this.use.getFormattedDate(this.reportDate), this.userId).subscribe(
    //   data => {
    //     console.log(data);
    //     this.petolQuantity = data[0];;
    //     this.dieselQuantity = data[1];
    //   }
    // );
  });
}

getPurchaselist(){
  const formattedDate = this.use.getFormattedDate(this.reportDate);
  this.use.getPurchaseiList(formattedDate, this.userId).subscribe(
    (data) => {
      if (data && data.length > 0) {
        this.petolQuantity = data[1] ?? 0;
        this.dieselQuantity = data[0] ?? 0;
      } else {
        this.petolQuantity = 0;
        this.dieselQuantity = 0;
      }
    },
    (error) => {
      this.notificationService.failure("Failed to fetch Purchase data.");
    }
  );
}

get totalCase(): number {
  return (
    (Number(this.totalRs) || 0) +
    (Number(this.oilsellTotal) || 0) -
    (Number(this.ATMTotal) || 0) -
    (Number(this.kharchTotal) || 0) -
    (Number(this.bakiTotal) || 0) +
    (Number(this.jamaTotal) || 0)
  );
}


dipstock(){
  const dataToSend: any = {
    date: this.use.getFormattedDate(this.reportDate),
  };

  // Determine if the type should be 'edit' or 'add' based on whether any of the values are not null
  if (this.Petrol_dip || this.Petrol_stock || this.Diesel_dip || this.Diesel_stock) {
    // If any data exists, send 'edit' type and the data values
    dataToSend.type = 'edit';
    dataToSend.petroldip = this.Petrol_dip || null;
    dataToSend.pvalue = this.Petrol_stock || null;
    dataToSend.dieseldip = this.Diesel_dip || null;
    dataToSend.dvalue = this.Diesel_stock || null;
  } else {
    // If all data values are null, send 'add' type only with date
    dataToSend.type = 'add';
    dataToSend.petroldip = this.Petrol_dip || null;
    dataToSend.pvalue = this.Petrol_stock || null;
    dataToSend.dieseldip = this.Diesel_dip || null;
    dataToSend.dvalue = this.Diesel_stock || null;
  }

  // Open the dialog with the prepared data
  const dialogRef = this.dialog.open(DipStockReportComponent, {
    width: '60%',
    height: '70%',
    data: dataToSend
  });
  
  dialogRef.afterClosed().subscribe(result => {
    this.getDiplist();
  });
}

getDiplist(){
  const formattedDate = this.use.getFormattedDate(this.reportDate);
  this.use.getDipList(formattedDate, this.userId).subscribe(
    (data) => {
      if (data && data.length > 0) {
        this.Petrol_dip = data[0][2] ?? 0;
        this.Petrol_stock = data[0][3] ?? 0;
        this.Diesel_dip = data[0][0] ?? 0;
        this.Diesel_stock = data[0][1] ?? 0;
      } else {
        this.Petrol_dip = 0;
        this.Petrol_stock = 0;
        this.Diesel_dip = 0;
        this.Diesel_stock = 0;
      }
    },
    (error) => {
      this.notificationService.failure("Failed to fetch Purchase data.");
    }
  );
}

get TotalPetrolStock(): number {
  const petrolUgadto = Number(this.Petrol_Ugadto_Stock) || 0;
  const petrolQty = Number(this.petolQuantity) || 0;
  return petrolUgadto + petrolQty;
}

get TotalDieselStock(): number {
  const dieselUgadto = Number(this.Diesel_Ugadto_Stock) || 0;
  const dieselQty = Number(this.dieselQuantity) || 0;
  return dieselUgadto + dieselQty;
}

get TotalPetrolRemaining(): number {
  return this.TotalPetrolStock - (Number(this.petrolTotalLTR) || 0);
}

get TotalDieselRemaining(): number {
  return this.TotalDieselStock - (Number(this.dieselTotalLTR) || 0);
}


Submit() {
  const formattedDate = this.use.getFormattedDate(this.reportDate);
//   const petrolInputData = this.petrolPumps
//   .filter(p => !(p.openingMeter === 0 && p.closingMeter === 0 && p.testing === 0 && p.rate === 0 && p.saleLtr === 0 && p.total_rs === 0 && p.ltr === 0))
//   .map(p => ({
//     date: String(this.use.getFormattedDate(this.reportDate)),      
//     user_id: String(this.userId),                                  
//     pump: String(p.name),                                          
//     open_meter: String(p.openingMeter),                            
//     close_meter: String(p.closingMeter),                           
//     testing: String(p.testing),                                    
//     rate: String(p.rate),                                          
//     petrol_ltr: String(p.saleLtr),                                      
//     total_sell: String(p.total_rs),                                
//     total: String(p.ltr)                                      
//   }));

// const dieselInputData = this.dieselPumps
//   .filter(d => !(d.openingMeter === 0 && d.closingMeter === 0 && d.testing === 0 && d.rate === 0 && d.saleLtr === 0 && d.total_rs === 0 && d.ltr === 0))
//   .map(d => ({
//     date: String(this.use.getFormattedDate(this.reportDate)),     
//     user_id: String(this.userId),                                 
//     pump: String(d.name),                                         
//     open_meter: String(d.openingMeter),                           
//     close_meter: String(d.closingMeter),                          
//     testing: String(d.testing),                                   
//     rate: String(d.rate),                                         
//     diesel_ltr: String(d.saleLtr),                                     
//     total_sell: String(d.total_rs),                               
//     total: String(d.ltr)                                     
//   }));
const petrolInputData = this.petrolPumps
  .filter(p => !(
    (p.openingMeter === 0 || p.openingMeter === null) && 
    (p.closingMeter === 0 || p.closingMeter === null) && 
    (p.testing === 0 || p.testing === null) && 
    (p.rate === 0 || p.rate === null) && 
    (p.saleLtr === 0 || p.saleLtr === null) && 
    (p.total_rs === 0 || p.total_rs === null) && 
    (p.ltr === 0 || p.ltr === null)
  ))
  .map(p => ({
    date: String(this.use.getFormattedDate(this.reportDate)),      
    user_id: String(this.userId),                                  
    pump: String(p.name),                                          
    open_meter: p.openingMeter !== null ? String(p.openingMeter) : '',                            
    close_meter: p.closingMeter !== null ? String(p.closingMeter) : '',                           
    testing: p.testing !== null ? String(p.testing) : '',                                    
    rate: p.rate !== null ? String(p.rate) : '',                                          
    petrol_ltr: p.saleLtr !== null ? String(p.saleLtr) : '',                                      
    total_sell: p.total_rs !== null ? String(p.total_rs) : '',                                
    total: p.ltr !== null ? String(p.ltr) : ''                                     
  }));
  const dieselInputData = this.dieselPumps
  .filter(d => !(
    (d.openingMeter === 0 || d.openingMeter === null) && 
    (d.closingMeter === 0 || d.closingMeter === null) && 
    (d.testing === 0 || d.testing === null) && 
    (d.rate === 0 || d.rate === null) && 
    (d.saleLtr === 0 || d.saleLtr === null) && 
    (d.total_rs === 0 || d.total_rs === null) && 
    (d.ltr === 0 || d.ltr === null)
  ))
  .map(d => ({
    date: String(this.use.getFormattedDate(this.reportDate)),     
    user_id: String(this.userId),                                 
    pump: String(d.name),                                         
    open_meter: d.openingMeter !== null ? String(d.openingMeter) : '',                           
    close_meter: d.closingMeter !== null ? String(d.closingMeter) : '',                          
    testing: d.testing !== null ? String(d.testing) : '',                                   
    rate: d.rate !== null ? String(d.rate) : '',                                         
    diesel_ltr: d.saleLtr !== null ? String(d.saleLtr) : '',                                     
    total_sell: d.total_rs !== null ? String(d.total_rs) : '',                               
    total: d.ltr !== null ? String(d.ltr) : ''                                     
  }));

  this.use.savefuleData(petrolInputData,dieselInputData).subscribe({
    next: res => {
      if (res.message.includes('successfully')) {
        this.notificationService.success("✅" + res.message);
      } else if (res.message.includes('already')){
       this.notificationService.failure("⚠️" + res.message);
      }
    }
  });

  this.use.savePetrolStockData(this.userId,formattedDate,this.TotalPetrolRemaining).subscribe({
    next: res => {
      if (res.message.includes('successfully')) {
        this.notificationService.success("✅" + res.message);
      } else if (res.message.includes('already')){
        this.notificationService.failure("⚠️" + res.message);
      }
    }
  });
  
  this.use.saveDieselStockData(this.userId,formattedDate,this.TotalDieselRemaining).subscribe({
    next: res => {
      if (res.message.includes('successfully')) {
        this.notificationService.success("✅" + res.message);
      } else if (res.message.includes('already')){
      this.notificationService.failure("⚠️" + res.message);
      }
    }
  });
  this.saveTotalCase();
  this.sendData();
  }
printReport() {
  const originalTitle = document.title;
  const formatted = this.use.getFormattedDate(this.reportDate);
  document.title = `${formatted}`;
  window.print();
  document.title = originalTitle;
}

saveTotalCase() { 
  const formattedDate = this.use.getFormattedDate(this.reportDate);
  this.use.saveTotalCase(this.userId,formattedDate,this.totalCase).subscribe({
    next: res => {   
      if (res.message.includes('successfully')) {
        this.notificationService.success("✅   " + res.message);
      } else if (res.message.includes('already')){
        this.notificationService.failure("⚠️" + res.message);
      }
    }
  });
}


calculateTotal() {
  this.twothousand = 2000 * (this.multipliers.twothousand || 0);
  this.fivehundred = 500 * (this.multipliers.fivehundred || 0);
  this.twohundred = 200 * (this.multipliers.twohundred || 0);
  this.onehundred = 100 * (this.multipliers.onehundred || 0);
  this.fifty = 50 * (this.multipliers.fifty || 0);
  this.twenty = 20 * (this.multipliers.twenty || 0);
  this.ten = 10 * (this.multipliers.ten || 0);

  // Calculate Total
  this.totalCaseCase =
    this.twothousand +
    this.fivehundred +
    this.twohundred +
    this.onehundred +
    this.fifty +
    this.twenty +
    this.ten;
}

sendData() {
  const formatted = this.use.getFormattedDate(this.reportDate);
  const payload = {
    date: formatted,
    note: this.note,
    totalCaseCase: this.totalCaseCase,
    denominations: [
      { value: 'twothousand', total: this.twothousand, count: this.multipliers.twothousand || 0 },
      { value: 'fivehundred', total: this.fivehundred, count: this.multipliers.fivehundred || 0 },
      { value: 'twohundred', total: this.twohundred, count: this.multipliers.twohundred || 0 },
      { value: 'onehundred', total: this.onehundred, count: this.multipliers.onehundred || 0 },
      { value: 'fifty',total: this.fifty, count: this.multipliers.fifty || 0 },
      { value: 'twenty',total: this.twenty, count: this.multipliers.twenty || 0 },
      { value: 'ten',total: this.ten, count: this.multipliers.ten || 0 }
    ],
    userId:this.userId
  };
  console.log("Sending Payload: ", payload);    
  this.use.saveMoneyDetails(payload).subscribe({
    next: res => {  
      if (res.message.includes('successfully')) {
        this.notificationService.success("✅" + res.message);
     } else if (res.message.includes('already')){
      this.notificationService.failure("⚠️" + res.message);
     }
    }
  });
}
downloadPDF() {
  const data = document.getElementById('printable-content') as HTMLElement;
  const formatted = this.use.getFormattedDate(this.reportDate);
  html2canvas(data, { scale: 2 }).then(canvas => {
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const contentDataURL = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    let position = 0;
    if (imgHeight > pageHeight) {
      let remainingHeight = imgHeight;
      while (remainingHeight > 0) {
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        remainingHeight -= pageHeight;
        position -= pageHeight;
        if (remainingHeight > 0) {
          pdf.addPage();
        }
      }
    } else {
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
    }
    pdf.save(`${formatted}.pdf`);
  });
}


getMoneyDetailsList(){
  const formattedDate = this.use.getFormattedDate(this.reportDate);
  this.use.getMoneyList(formattedDate, this.userId).subscribe(
    (data) => {
      this.note=data[0].note;
    this.totalCaseCase=data[0].totalCase;
    this.multipliers.twothousand = data[0].twothousand;
    this.multipliers.fivehundred = data[0].fivehundred;
    this.multipliers.twohundred = data[0].twohundred;
    this.multipliers.onehundred = data[0].onehundred;
    this.multipliers.fifty = data[0].fifty;
    this.multipliers.twenty = data[0].twenty;
    this.multipliers.ten = data[0].ten;
    this.calculateTotal();
    },
    (error) => {
      this.notificationService.failure("Failed to fetch Purchase data.");
  }
  );
}
  
backPage() {
  const userId = localStorage.getItem('userId');
  const formattedDate = this.use.getFormattedDate(this.reportDate);
  const apiUrl = `${API_BACKPAGE}?date=${formattedDate}&userId=${userId}`;
  
  this.http.get<BackPageResponse>(apiUrl, {
    headers: {
      'Authorization': `Bearer ${userId}`
    }
  }).subscribe(
    response => {
      console.log(response);
      this.kharchSellSummary = response.kharchSellSummary || [];
      this.transactionSellSummary = response.transactionSellSummary || [];
      this.jamaSummary = response.jamaSummary || [];
      this.bakiSummary = response.bakiSummary || [];

      this.firstTableData = this.jamaSummary;
      this.secondTableData = this.bakiSummary;

      // this.firstTableData = this.jamaSummary.filter(item => item[1] <= 10000);
      // this.secondTableData = this.bakiSummary.filter(item => item[1] <= 10000);
    },
    error => {
      console.error('Error fetching data', error);
      this.firstTableData = [];
      this.secondTableData = [];
    }
  );
}

}
