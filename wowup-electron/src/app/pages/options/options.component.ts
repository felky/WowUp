import { Component, OnInit, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { WowClientType } from 'app/models/warcraft/wow-client-type';
import { ElectronService } from 'app/services';
import { WarcraftService } from 'app/services/warcraft/warcraft.service';
import { WowUpService } from 'app/services/wowup/wowup.service';
import { Preferences } from '../../../constants';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit, OnChanges {

  public retailLocation = '';
  public classicLocation = '';
  public retailPtrLocation = '';
  public classicPtrLocation = '';
  public betaLocation = '';
  public collapseToTray = false;
  public telemetryEnabled = false;

  constructor(
    private warcraft: WarcraftService,
    private _wowUpService: WowUpService,
    private zone: NgZone,
    public electronService: ElectronService
  ) {
    _wowUpService.preferenceChange$
      .pipe(filter(change => change.key === Preferences.telemetryEnabledKey))
      .subscribe(change => {
        this.telemetryEnabled = change.value === true.toString()
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }

  ngOnInit(): void {
    this.loadData();
  }

  onShowLogs = () => {
    this._wowUpService.showLogsFolder();
  }

  onReScan = () => {
    this.warcraft.scanProducts();
    this.loadData();
  }

  onTelemetryChange = (evt: MatSlideToggleChange) => {
    this._wowUpService.telemetryEnabled = evt.checked;
  }

  onCollapseChange = (evt: MatSlideToggleChange) => {
    this._wowUpService.collapseToTray = evt.checked;
  }

  private loadData() {
    this.zone.run(() => {
      this.telemetryEnabled = this._wowUpService.telemetryEnabled;
      this.collapseToTray = this._wowUpService.collapseToTray;
      this.retailLocation = this.warcraft.getClientLocation(WowClientType.Retail);
      this.classicLocation = this.warcraft.getClientLocation(WowClientType.Classic);
      this.retailPtrLocation = this.warcraft.getClientLocation(WowClientType.RetailPtr);
      this.classicPtrLocation = this.warcraft.getClientLocation(WowClientType.ClassicPtr);
      this.betaLocation = this.warcraft.getClientLocation(WowClientType.Beta);
    })
  }

}