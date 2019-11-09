export class TrafficLight {
  private _isUpdatesEnabled = true;

  get isUpdatesEnabled() {
    return this._isUpdatesEnabled;
  }

  set isUpdatesEnabled(value: boolean) {
    this._isUpdatesEnabled = value;
  }
}
