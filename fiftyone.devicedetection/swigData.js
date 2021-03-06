/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2019 51 Degrees Mobile Experts Limited, 5 Charlotte Close,
 * Caversham, Reading, Berkshire, United Kingdom RG4 7BY.
 *
 * This Original Work is licensed under the European Union Public Licence (EUPL)
 * v.1.2 and is subject to its terms as set out below.
 *
 * If a copy of the EUPL was not distributed with this file, You can obtain
 * one at https://opensource.org/licenses/EUPL-1.2.
 *
 * The 'Compatible Licences' set out in the Appendix to the EUPL (as may be
 * amended by the European Commission) shall be deemed incompatible for
 * the purposes of the Work and the provisions of the compatibility
 * clause in Article 5 of the EUPL shall not apply.
 *
 * If using the Work as, or as part of, a network application, by
 * including the attribution notice(s) required under Article 5 of the EUPL
 * in the end user terms of the application under an appropriate heading,
 * such notice(s) shall fulfill the requirements of that article.
 * ********************************************************************* */

const require51 = (requestedPackage) => {
  try {
    return require(__dirname + '/../' + requestedPackage);
  } catch (e) {
    return require(requestedPackage);
  }
};

const AspectData = require51('fiftyone.pipeline.engines').AspectData;
const AspectPropertyValue = require51('fiftyone.pipeline.core').AspectPropertyValue;

const swigHelpers = require('./swigHelpers');

const DataFileMissingPropertyService = require('./dataFileMissingPropertyService');

/**
 * Extension of aspectData which stores the results created by the SWIG wrapper
 */
class SwigData extends AspectData {
  /**
   * Constructor for SwigData
   *
   * @param {object} options options object
   * @param {FlowElement} options.flowElement the FlowElement the
   * data is part of
   * @param {ResultsHashSwig} options.swigResults the results from the
   * swig engine
   */
  constructor ({
    flowElement, swigResults
  }) {
    super(...arguments);
    this.swigResults = swigResults;
    this.missingPropertyService = new DataFileMissingPropertyService();
  }

  /**
   * Retrieves elementData via the swigWrapper but also casts it to the
   * correct type via a check of the engine's property list metadata
   *
   * @param {string} key the property key to retrieve
   * @returns {mixed} value property value
   */
  getInternal (key) {
    // Start with special properties

    const result = new AspectPropertyValue();

    if (key === 'deviceID') {
      result.value = this.swigResults.getDeviceId();

      return result;
    }

    if (key === 'userAgents') {
      result.value = this.swigResults.getUserAgents();

      return result;
    }

    if (key === 'difference') {
      result.value = this.swigResults.getDifference();

      return result;
    }

    if (key === 'method') {
      result.value = this.swigResults.getMethod();

      return result;
    }

    if (key === 'matchedNodes') {
      result.value = this.swigResults.getMatchedNodes();

      return result;
    }

    if (key === 'drift') {
      result.value = this.swigResults.getDrift();

      return result;
    }

    // End special properties

    const property = this.flowElement.properties[key];

    if (property) {
      let value;

      switch (property.type) {
        case 'bool':
          value = this.swigResults.getValueAsBool(property.name);
          break;
        case 'string':
          value = this.swigResults.getValueAsString(property.name);
          break;
        case 'javascript':
          value = this.swigResults.getValueAsString(property.name);
          break;
        case 'int':
          value = this.swigResults.getValueAsInteger(property.name);
          break;
        case 'double':
          value = this.swigResults.getValueAsDouble(property.name);
          break;
        case 'string[]':
          value = this.swigResults.getValues(property.name);
          break;
      }

      const result = new AspectPropertyValue();

      if (value.hasValue()) {
        result.value = value.getValue();

        if (property.type === 'string[]') {
          result.value = swigHelpers.vectorToArray(result.value);
        }
      } else {
        result.noValueMessage = value.getNoValueMessage();
      }

      return result;
    }
  }
}

module.exports = SwigData;
