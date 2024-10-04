import { Asset, Company, Component, Location } from "./data-models";

export const mapCompanies = (
  apiCompanies: Record<string, string>[]
): Company[] => {
  return apiCompanies.map(
    (company) => new Company(company.id, company.name)
  );
};

export const mapLocations = (
  apiLocations: Record<string, string>[]
): Location[] => {
  const rootLocations: Location[] = [];
  const childrenLocationsMap = new Map<string, Location[]>();

  for (const apiLocation of apiLocations) {
    const location: Location = new Location(
      apiLocation.id,
      apiLocation.name,
      []
    );

    if (!apiLocation.parentId) {
      rootLocations.push(location);
    } else {
      if (!childrenLocationsMap.has(apiLocation.parentId!)) {
        childrenLocationsMap.set(apiLocation.parentId!, []);
      }

      childrenLocationsMap.get(apiLocation.parentId!)!.push(location);
    }
  }

  const locationsStack = [...rootLocations];

  while (locationsStack.length) {
    const location = locationsStack.pop()!;

    if (childrenLocationsMap.has(location.id)) {
      const subLocations = childrenLocationsMap.get(location.id)!;

      if (!("children" in location)) location.children = [];

      location.children!.push(...subLocations);
      locationsStack.push(...subLocations);
    }
  }

  return rootLocations;
};

const mapAssetOrComponent = (apiAssetOrComponent: any): Asset | Component => {
  if (apiAssetOrComponent.sensorType !== null) {
    const component = new Component(
      apiAssetOrComponent.id,
      apiAssetOrComponent.name,
      apiAssetOrComponent.sensorId,
      apiAssetOrComponent.sensorType,
      apiAssetOrComponent.status,
      apiAssetOrComponent.gatewayId
    );

    return component;
  }
  const asset = new Asset(apiAssetOrComponent.id, apiAssetOrComponent.name);

  return asset;
};

export const mapLocationAssets = (
  rootLocations: Location[],
  apiAssets: Record<string, string>[]
): Array<Location | Asset> => {
  const rootAssetsMap = new Map<string, Array<Component | Asset>>();
  const childrenAssetsMap = new Map<string | null, Array<Asset | Component>>();

  console.log(apiAssets);

  for (const apiAsset of apiAssets) {
    if (apiAsset.locationId != null) {
      if (!rootAssetsMap.has(apiAsset.locationId)) {
        rootAssetsMap.set(apiAsset.locationId, []);
      }

      rootAssetsMap
        .get(apiAsset.locationId)!
        .push(mapAssetOrComponent(apiAsset));
    } else {
      if (!childrenAssetsMap.has(apiAsset.parentId)) {
        childrenAssetsMap.set(apiAsset.parentId, []);
      }

      childrenAssetsMap
        .get(apiAsset.parentId)!
        .push(mapAssetOrComponent(apiAsset));
    }
  }

  console.log(rootAssetsMap, childrenAssetsMap);

  const assetsStack: Asset[] = Array.from(rootAssetsMap.values())
    .flat(2)
    .filter((item) => item instanceof Asset);

  while (assetsStack.length) {
    const item = assetsStack.pop()!;

    if (childrenAssetsMap.has(item.id)) {
      const components: Component[] = childrenAssetsMap
        .get(item.id)!
        .filter((assetOrComponent) => "sensorType" in assetOrComponent);
      const subAssets: Asset[] = childrenAssetsMap
        .get(item.id)!
        .filter((assetOrComponent) => !("sensorType" in assetOrComponent));

      if (components.length) {
        if (!item.components) {
          item.components = [];
        }

        item.components!.push(...components);
      }

      if (subAssets.length) {
        if (!item.children) {
          item.children = [];
        }

        item.children!.push(...subAssets);
        assetsStack.push(...subAssets);
      }
    }
  }

  const populateLocationAssets = (locations: Location[]): Location[] => {
    return locations.map(
      (location) =>
        new Location(
          location.id,
          location.name,
          populateLocationAssets(location.children ?? []),
          rootAssetsMap.get(location.id)
        )
    );
  };

  return [
    ...populateLocationAssets(rootLocations),
    // components without a location
    ...(childrenAssetsMap.get(null)?.flat() ?? []),
  ];
};
