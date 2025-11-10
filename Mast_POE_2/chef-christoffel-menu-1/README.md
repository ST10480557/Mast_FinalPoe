# Chef Christoffel Menu

This project is a mobile application designed for Chef Christoffel to manage and showcase his culinary menu. The app allows customers to view the latest dishes and provides an interface for the chef to easily add, remove, and update menu items.

## Features

- **Dynamic Menu Management**: Chef Christoffel can add, edit, and remove dishes from the menu.
- **Customer Access**: Customers can view the latest menu items, filter by course (Starters, Mains, Desserts), and search for specific dishes.
- **Theme Customization**: Users can switch between different themes to enhance the visual appeal of the application.
- **Local Storage**: The app uses AsyncStorage to persist menu items, ensuring that changes are saved even after the app is closed.

## Project Structure

```
chef-christoffel-menu
├── src
│   ├── App.tsx                # Main entry point of the application
│   ├── components              # Reusable components
│   │   ├── Header.tsx         # Displays the app header
│   │   ├── Nav.tsx            # Navigation between customer and chef screens
│   │   ├── Card.tsx           # Displays individual dish details
│   │   └── ThemeSwitcher.tsx   # Allows theme switching
│   ├── screens                 # Screen components
│   │   ├── Customer.tsx       # Customer view of the menu
│   │   └── Chef.tsx           # Chef's management interface
│   ├── styles                  # Styles for the application
│   │   ├── theme.ts            # Theme definitions
│   │   └── globals.ts          # Global styles
│   └── utils                   # Utility functions
│       └── storage.ts          # Functions for local storage
├── package.json                # npm configuration
├── tsconfig.json               # TypeScript configuration
├── babel.config.js             # Babel configuration
└── README.md                   # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/chef-christoffel-menu.git
   ```
2. Navigate to the project directory:
   ```
   cd chef-christoffel-menu
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm start
```

This will launch the app in your default web browser or mobile simulator.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.