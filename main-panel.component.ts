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

  constructor(private dialog: MatDialog,private use:UserServiceService,
    private notificationService:NotificationService
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
  }
  
  
  ngOnInit() {
    this.getUserName();
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
        pump.openingMeter = 0;
        pump.closingMeter = 0;
        pump.saleLtr = 0;
        pump.testing = 0;
        pump.ltr = 0;
        pump.rate = 0;
        pump.total_rs = 0;
      });
  
      data.forEach((item: any) => {
        const pump = this.petrolPumps.find(p => p.name === item.pump);
        if (pump) {
          pump.openingMeter = +item.open_meter;
          pump.closingMeter = +item.close_meter;
          pump.testing = +item.testing;
          pump.saleLtr = pump.closingMeter - pump.openingMeter;
          pump.rate = +item.rate; 
          pump.total_rs = pump.saleLtr * pump.rate;    
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
        pump.openingMeter = 0;
        pump.closingMeter = 0;
        pump.saleLtr = 0;
        pump.testing = 0;
        pump.ltr = 0;
        pump.rate = 0;
        pump.total_rs = 0;
      });
  
      // Map the response data to dieselPumps based on pump name
      data.forEach((item: any) => {
        const pump = this.dieselPumps.find(p => p.name === item.pump);
        if (pump) {
          pump.openingMeter = +item.open_meter;
          pump.closingMeter = +item.close_meter;
          pump.testing = +item.testing;
          pump.saleLtr = pump.closingMeter - pump.openingMeter;
          pump.rate = +item.rate; // Assuming `rate` is in your response
          pump.total_rs = pump.saleLtr * pump.rate;
        }
      });
      this.calculateTotals();
    });
  }

  calculateTotals() {
    this.petrolTotalLTR = this.petrolPumps.reduce((sum, p) => sum + p.saleLtr, 0);
    this.petrolTotalRS = this.petrolPumps.reduce((sum, p) => sum + p.total_rs, 0);
  
    this.dieselTotalLTR = this.dieselPumps.reduce((sum, p) => sum + p.saleLtr, 0);
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
  const dialogRef = this.dialog.open(OilReportComponent, {
    width: '60%',
    height: '70%',
    data: { date: formattedDate }
  });
  dialogRef.afterClosed().subscribe(result => {
    this.getoillist();
  });
}

getoillist(){
  const formattedDate = this.use.getFormattedDate(this.reportDate);
  this.use.getOillsellList(formattedDate, this.userId).subscribe(
    (data) => {
      if (data && data.length > 0) {
        this.oilsellTotal = data[0];
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
  });
}

getTransactionlist(){
  const formattedDate = this.use.getFormattedDate(this.reportDate);
  this.use.getTransactionList(formattedDate, this.userId).subscribe(
    (data) => {
      if (data && data.length > 0) {
        this.ATMTotal = data[0];
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
        this.kharchTotal = data[0];
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
        this.jamaTotal = data[0][0];
        this.bakiTotal = data[0][1];
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
        this.petolQuantity = data[0];;
        this.dieselQuantity = data[1];
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
  const dialogRef=this.dialog.open(DipStockReportComponent, {
    width: '60%',
    height: '70%',
    data: { date: this.use.getFormattedDate(this.reportDate),
      petroldip: this.Petrol_dip,
      pvalue: this.Petrol_stock,
      dieseldip: this.Diesel_dip,
      dvalue: this.Diesel_stock
    }
    
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
        this.Petrol_dip = data[0][2];
        this.Petrol_stock = data[0][3];
        this.Diesel_dip = data[0][0];
        this.Diesel_stock = data[0][1];
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
  const petrolInputData = this.petrolPumps
  .filter(p => !(p.openingMeter === 0 && p.closingMeter === 0 && p.testing === 0 && p.rate === 0 && p.saleLtr === 0 && p.total_rs === 0 && p.ltr === 0))
  .map(p => ({
    date: String(this.use.getFormattedDate(this.reportDate)),      
    user_id: String(this.userId),                                  
    pump: String(p.name),                                          
    open_meter: String(p.openingMeter),                            
    close_meter: String(p.closingMeter),                           
    testing: String(p.testing),                                    
    rate: String(p.rate),                                          
    petrol_ltr: String(p.saleLtr),                                      
    total_sell: String(p.total_rs),                                
    total: String(p.ltr)                                      
  }));

const dieselInputData = this.dieselPumps
  .filter(d => !(d.openingMeter === 0 && d.closingMeter === 0 && d.testing === 0 && d.rate === 0 && d.saleLtr === 0 && d.total_rs === 0 && d.ltr === 0))
  .map(d => ({
    date: String(this.use.getFormattedDate(this.reportDate)),     
    user_id: String(this.userId),                                 
    pump: String(d.name),                                         
    open_meter: String(d.openingMeter),                           
    close_meter: String(d.closingMeter),                          
    testing: String(d.testing),                                   
    rate: String(d.rate),                                         
    diesel_ltr: String(d.saleLtr),                                     
    total_sell: String(d.total_rs),                               
    total: String(d.ltr)                                     
  }));

  this.use.savefuleData(petrolInputData,dieselInputData).subscribe({
    next: res => {
      if (res.message.includes('successfully')) {
        this.notificationService.success("✅ " + res.message);
    } else if (res.message.includes('already')){
      this.notificationService.failure("⚠️ " + res.message);
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
        this.notificationService.success("✅   " + res.message);
     } else if (res.message.includes('already')){
      this.notificationService.failure("⚠️" + res.message);
     }
    }
  });
}
printReport() {
  window.print();
}

}
