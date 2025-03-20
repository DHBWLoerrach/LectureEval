import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { BarChart as NormalBarChart } from 'react-native-chart-kit';
import { colors } from '~/styles/colors';

type Props = {
  values: number[];
  labels: string[];
};

const BarChart = ({ values, labels }: Props) => {
  const [parentWidth, setParentWidth] = useState(0);

  const data = values.map((count, index) => ({
    label: labels[index] || '',
    value: count,
  }));

  const chartData = useMemo(
    () => ({
      labels: data.map((item) => item.label),
      datasets: [
        {
          data: data.map((item) => item.value),
        },
      ],
    }),
    [data]
  );

  return (
    <View
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setParentWidth(width);
      }}
    >
      <NormalBarChart
        data={chartData}
        width={parentWidth}
        height={300}
        yAxisLabel=""
        yAxisSuffix=""
        yLabelsOffset={40}
        showValuesOnTopOfBars={true}
        chartConfig={{
          backgroundColor: colors.white,
          backgroundGradientFrom: colors.white,
          backgroundGradientTo: colors.white,
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(226, 0, 26, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.5,
          paddingTop: 0,
        }}
      />
    </View>
  );
};

export default BarChart;
