import React, { useEffect, useState } from 'react';
import { ResponsiveBubble } from '@nivo/circle-packing';
import { upperCase } from 'lodash';

const IwdBubbleChart = ({ data = [] }) => {
  const [dataList, setDataList] = useState([]);

  const dataFormatter = () => {
    const list = [];
    data.forEach(({ name, share }, idx) => {
      list.push({
        name: upperCase(name),
        value: `${share}`,
        color: `rgba(57, 183, 171, ${1 - ( idx / data.length)})`,
      });
    });
    setDataList(list);
  };

  useEffect(() => {
    dataFormatter();
  }, [data]);

  return (
    <ResponsiveBubble
      root={{
        name: 'main',
        children: dataList,
      }}
      // margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      identity='name'
      value='value'
      leavesOnly={true}
      colors={(item) => item.color}
      enableLabel={false}
      colorBy='name'
      padding={6}
      animate={false}
      isInteractive={false}
      motionStiffness={90}
      motionDamping={12}
    />
  );
};

export default IwdBubbleChart;
