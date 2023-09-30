import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ForumPostDefault from '../screens/forum/ForumPostDefault';
import ForumPostHot from '../screens/forum/ForumPostHot';

const Tab = createMaterialTopTabNavigator();

const ForumPostTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Forum Post Default" component={ForumPostDefault} />
      <Tab.Screen name="Forum Topic Hot" component={ForumPostHot} />
    </Tab.Navigator>
  );
}

export default ForumPostTabNavigator;