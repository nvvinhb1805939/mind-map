// @mui
import { RadioGroup } from '@mui/material';
//
import { useSettingsContext } from '../SettingsContext';
import { StyledCard, StyledWrap, MaskControl, LayoutIcon } from '../styles';

// ----------------------------------------------------------------------

// const OPTIONS = ['vertical', 'horizontal', 'mini']; // origin

const OPTIONS = ['vertical', 'mini']; // custom

export default function LayoutOptions() {
  const { themeLayout, onChangeLayout } = useSettingsContext();

  return (
    <RadioGroup name="themeLayout" value={themeLayout} onChange={onChangeLayout}>
      <StyledWrap sx={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {OPTIONS.map((layout) => (
          <StyledCard key={layout} selected={themeLayout === layout} sx={{ p: 0.75 }}>
            <LayoutIcon layout={layout} />

            <MaskControl value={layout} />
          </StyledCard>
        ))}
      </StyledWrap>
    </RadioGroup>
  );
}
