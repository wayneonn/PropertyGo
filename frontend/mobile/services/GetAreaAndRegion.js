export const getAreaAndRegion = async (postalCode) => {
    // Define a lookup table for postal code ranges and their corresponding areas and regions
    
    console.log("area and region: ",postalCode);
    const firstTwoDigits = postalCode.substring(0, 2);
    const postalCodeLookup = [
      { range: [1, 6], area: 'Raffles Place, Cecil, Marina, People’s Park', region: 'Central' },
      { range: [7, 8], area: 'Anson, Tanjong Pagar', region: 'Central' },
      { range: [14, 16], area: 'Queenstown, Tiong Bahru', region: 'Central' },
      { range: [9, 10], area: 'Telok Blangah, Harbourfront', region: 'Central' },
      { range: [11, 13], area: 'Pasir Panjang, Hong Leong Garden, Clementi New Town', region: 'Central' },
      { range: [17], area: 'High Street, Beach Road (part)', region: 'Central' },
      { range: [18, 19], area: 'Middle Road, Golden Mile', region: 'Central' },
      { range: [20, 21], area: 'Little India', region: 'Central' },
      { range: [22, 23], area: 'Orchard, Cairnhill, River Valley', region: 'Central' },
      { range: [24, 27], area: 'Ardmore, Bukit Timah, Holland Road, Tanglin', region: 'Central' },
      { range: [28, 30], area: 'Watten Estate, Novena, Thomson', region: 'Central' },
      { range: [31, 33], area: 'Balestier, Toa Payoh, Serangoon', region: 'Central' },
      { range: [34, 37], area: 'Macpherson, Braddell', region: 'Central' },
      { range: [38, 41], area: 'Geylang, Eunos', region: 'Central' },
      { range: [42, 45], area: 'Katong, Joo Chiat, Amber Road', region: 'Central' },
      { range: [46, 48], area: 'Bedok, Upper East Coast, Eastwood, Kew Drive', region: 'Central' },
      { range: [49, 50, 81], area: 'Loyang, Changi', region: 'East' },
      { range: [51, 52], area: 'Tampines, Pasir Ris', region: 'East' },
      { range: [53, 55, 82], area: 'Serangoon Garden, Hougang, Punggol', region: 'North-East' },
      { range: [56, 57], area: 'Bishan, Ang Mo Kio', region: 'North-East' },
      { range: [58, 59], area: 'Upper Bukit Timah, Clementi Park, Ulu Pandan', region: 'West' },
      { range: [60, 64], area: 'Jurong', region: 'West' },
      { range: [65, 68], area: 'Hillview, Dairy Farm, Bukit Panjang, Choa Chu Kang', region: 'West' },
      { range: [69, 71], area: 'Lim Chu Kang, Tengah', region: 'West' },
      { range: [72, 73], area: 'Kranji, Woodgrove', region: 'North' },
      { range: [77, 78], area: 'Upper Thomson, Springleaf', region: 'North' },
      { range: [75, 76], area: 'Yishun, Sembawang', region: 'North' },
      { range: [79, 80], area: 'Seletar', region: 'North' },
    ];
  
    // Convert the postal code to a number (assuming postalCode is a string)
    const code = parseInt(firstTwoDigits);
  
    // Find the matching range and return the corresponding area and region
    console.log("code: ",code);
    const match = postalCodeLookup.find(({ range }) => {
      return code >= range[0] && code <= range[range.length - 1];
    });
  
    if (match) {
        console.log("match: ",match);
      return {
        area: match.area,
        region: match.region,
      };
    } else {
      return {
        area: 'Unknown',
        region: 'Unknown',
      };
    }
  };
  
  
  export const getForumIdByRegion = (areaName) => {
    const areas = [
      {
        "forumTopicId": 1,
        "topicName": "Raffles Place, Cecil, Marina, People’s Park",
      },
      {
        "forumTopicId": 2,
        "topicName": "Anson, Tanjong Pagar",
      },
      {
        "forumTopicId": 3,
        "topicName": "Queenstown, Tiong Bahru",
      },
      {
        "forumTopicId": 4,
        "topicName": "Telok Blangah, Harbourfront",
      },
      {
        "forumTopicId": 5,
        "topicName": "Pasir Panjang, Hong Leong Garden, Clementi New Town",
      },
      {
        "forumTopicId": 6,
        "topicName": "High Street, Beach Road (part)",
      },
      {
        "forumTopicId": 7,
        "topicName": "Middle Road, Golden Mile",
      },
      {
        "forumTopicId": 8,
        "topicName": "Little India",
      },
      {
        "forumTopicId": 9,
        "topicName": "Orchard, Cairnhill, River Valley",
      },
      {
        "forumTopicId": 10,
        "topicName": "Ardmore, Bukit Timah, Holland Road, Tanglin",
      },
      {
        "forumTopicId": 11,
        "topicName": "Watten Estate, Novena, Thomson",
      },
      {
        "forumTopicId": 12,
        "topicName": "Balestier, Toa Payoh, Serangoon",
      },
      {
        "forumTopicId": 13,
        "topicName": "Macpherson, Braddell",
      },
      {
        "forumTopicId": 14,
        "topicName": "Geylang, Eunos",
      },
      {
        "forumTopicId": 15,
        "topicName": "Katong, Joo Chiat, Amber Road",
      },
      {
        "forumTopicId": 16,
        "topicName": "Bedok, Upper East Coast, Eastwood, Kew Drive",
      },
      {
        "forumTopicId": 17,
        "topicName": "Loyang, Changi",
      },
      {
        "forumTopicId": 18,
        "topicName": "Tampines, Pasir Ris",
      },
      {
        "forumTopicId": 19,
        "topicName": "Serangoon Garden, Hougang, Punggol",
      },
      {
        "forumTopicId": 20,
        "topicName": "Bishan, Ang Mo Kio",
      },
      {
        "forumTopicId": 21,
        "topicName": "Upper Bukit Timah, Clementi Park, Ulu Pandan",
      },
      {
        "forumTopicId": 22,
        "topicName": "Jurong",
      },
      {
        "forumTopicId": 23,
        "topicName": "Hillview, Dairy Farm, Bukit Panjang, Choa Chu Kang",
      },
      {
        "forumTopicId": 24,
        "topicName": "Lim Chu Kang, Tengah",
      },
      {
        "forumTopicId": 25,
        "topicName": "Kranji, Woodgrove",
      },
      {
        "forumTopicId": 26,
        "topicName": "Upper Thomson, Springleaf",
      },
      {
        "forumTopicId": 27,
        "topicName": "Yishun, Sembawang",
      },
      {
        "forumTopicId": 28,
        "topicName": "Seletar",
      }
    ];
  
    const matchingArea = areas.find((area) =>
      area.topicName.toLowerCase().includes(areaName.toLowerCase())
    );
  
    return matchingArea ? matchingArea.forumTopicId : null;
  };
  