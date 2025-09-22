import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  BackHandler,
} from 'react-native';
import ChevronDownIcon from './svg-icons/ChevronDownIcon';
import ChevronRightIcon from './svg-icons/ChevronRightIcon';
import {COLORS} from '../constants/colors';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  style?: any;
  dropdownStyle?: any;
}

export default function CustomDropdown({
  options,
  selectedValue,
  onValueChange,
  placeholder = 'Select option',
  label,
  style,
  dropdownStyle,
}: DropdownProps) {
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef<View>(null);
  const selectedOption = options.find(opt => opt.value === selectedValue);

  // Close dropdown when component loses focus or on back button press
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const handleBackPress = () => {
      setIsVisible(false);
      return true; // Prevent default back button behavior
    };

    // Add back button handler for Android
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => subscription?.remove();
  }, [isVisible]);

  const renderOption = ({item}: {item: DropdownOption}) => (
    <TouchableOpacity
      style={[
        styles.option,
        selectedValue === item.value && styles.selectedOption,
      ]}
      onPress={() => {
        onValueChange(item.value);
        setIsVisible(false);
      }}>
      <Text
        style={[
          styles.optionText,
          selectedValue === item.value && styles.selectedOptionText,
        ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View ref={dropdownRef} style={[styles.container, style]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TouchableOpacity
          style={[styles.dropdownButton, dropdownStyle]}
          onPress={() => setIsVisible(!isVisible)}
          activeOpacity={0.7}>
          <Text style={styles.selectedText}>
            {selectedOption?.label || placeholder}
          </Text>
          <View style={styles.iconContainer}>
            {isVisible ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </View>
        </TouchableOpacity>

        {isVisible && (
          <View style={styles.dropdownList}>
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={item => item.value}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>

      {isVisible && (
        <TouchableOpacity
          style={styles.backdrop}
          onPress={() => setIsVisible(false)}
          activeOpacity={1}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 48,
  },
  selectedText: {
    fontSize: 16,
    color: COLORS.grayDark,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    marginTop: 4,
    zIndex: 999,
    maxHeight: 200,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    minHeight: 48,
  },
  selectedOption: {
    backgroundColor: COLORS.accent,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.grayDark,
  },
  selectedOptionText: {
    color: COLORS.textLight,
    fontWeight: '500',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998,
  },
});
