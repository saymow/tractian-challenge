export class Company {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly locations?: Array<Location | Component>
  ) {}
}

export class Location {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public children?: Location[],
    public assets?: Array<Asset | Component>
  ) {}
}

export class Asset {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public children?: Array<Asset>,
    public components?: Array<Component>
  ) {}
}

export class Component {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly sensorId: string,
    public readonly sensorType: string,
    public readonly status: string,
    public readonly gatewayId: string,
    public selected?: boolean
  ) {}
}

export type Node = Company | Location | Asset | Component;
