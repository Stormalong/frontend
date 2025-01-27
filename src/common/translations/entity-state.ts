import type { HassConfig, HassEntity } from "home-assistant-js-websocket";
import type { FrontendLocaleData } from "../../data/translation";
import type { HomeAssistant } from "../../types";
import type { LocalizeFunc } from "./localize";

export type FormatEntityStateFunc = (
  stateObj: HassEntity,
  state?: string
) => string;
export type FormatEntityAttributeValueFunc = (
  stateObj: HassEntity,
  attribute: string,
  value?: any
) => string;
export type FormatEntityAttributeNameFunc = (
  stateObj: HassEntity,
  attribute: string
) => string;

export const computeFormatFunctions = async (
  localize: LocalizeFunc,
  locale: FrontendLocaleData,
  config: HassConfig,
  entities: HomeAssistant["entities"],
  sensorNumericDeviceClasses: string[]
): Promise<{
  formatEntityState: FormatEntityStateFunc;
  formatEntityAttributeValue: FormatEntityAttributeValueFunc;
  formatEntityAttributeName: FormatEntityAttributeNameFunc;
}> => {
  const { computeStateDisplay } = await import(
    "../entity/compute_state_display"
  );
  const { computeAttributeValueDisplay, computeAttributeNameDisplay } =
    await import("../entity/compute_attribute_display");

  return {
    formatEntityState: (stateObj, state) =>
      computeStateDisplay(
        localize,
        stateObj,
        locale,
        sensorNumericDeviceClasses,
        config,
        entities,
        state
      ),
    formatEntityAttributeValue: (stateObj, attribute, value) =>
      computeAttributeValueDisplay(
        localize,
        stateObj,
        locale,
        config,
        entities,
        attribute,
        value
      ),
    formatEntityAttributeName: (stateObj, attribute) =>
      computeAttributeNameDisplay(localize, stateObj, entities, attribute),
  };
};
