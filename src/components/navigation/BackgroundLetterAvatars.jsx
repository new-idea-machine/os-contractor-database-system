import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

export default function BackgroundLetterAvatars(props) {
  const profileFirstName = props.currentUserFirstName;
  const profileLastName = props.currentUserLastName;
  
  const stringToColor = (string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  };

  const stringAvatar = (firstName, lastName) => {
    if (firstName && lastName) {
      return {
        sx: {
          bgcolor: stringToColor(firstName),
        },
        children: `${firstName[0]}${lastName[0]}`,
      };
    }
  
    // Return a default avatar if first or last name is missing
    return {
      sx: {
        bgcolor: '#000000',
      },
      children: 'NA',
    };
  };

  return (
    <Stack direction="row" spacing={2}>
      <Avatar {...stringAvatar(profileFirstName, profileLastName)} />
    </Stack>
  );
}
