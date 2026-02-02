# Copilot Instructions for the Free-for-Service UI Project

## Project Overview
This project is a **Next.js** application designed for managing tenant administration dashboards. It utilizes **Redux** for state management and follows a modular component structure. The application is structured to facilitate easy navigation and component reuse.

## Architecture
- **Main Components**: The application is divided into several key directories:
  - **`src/app`**: Contains the main application layout and routing.
  - **`src/components`**: Houses reusable UI components, such as charts and buttons.
  - **`src/state`**: Manages application state using Redux, with specific models for dashboard data.
  - **`src/hooks`**: Custom hooks for managing state and side effects.

- **Data Flow**: Data is fetched and managed through Redux actions and reducers. Components connect to the Redux store to access the necessary state, such as `dashboardData`.

## Developer Workflows
- **Starting the Development Server**: Use the following command to run the application:
  ```bash
  yarn dev
  ```
  This will start the server at [http://localhost:3000](http://localhost:3000).

- **Building the Application**: To create a production build, run:
  ```bash
  yarn build
  ```

- **Testing**: Ensure to run tests using:
  ```bash
  yarn test
  ```

## Project-Specific Conventions
- **Component Naming**: Components are named using PascalCase, e.g., `DashboardWidget`.
- **File Structure**: Each component should have its own directory containing the component file and associated styles.
- **State Management**: Use Redux for managing global state. Actions and reducers should be defined in the `src/state` directory.

## Integration Points
- **External Dependencies**: The project uses several libraries, including:
  - **ECharts** for data visualization.
  - **React-Redux** for state management.
  
- **Cross-Component Communication**: Components communicate through props and Redux state. For example, the `index` component in `src/app/(withheader)/tenantadmin/dashboard/components/widgets/default/index.tsx` connects to the Redux store to retrieve `dashboardData`.

## Examples
- **Connecting to Redux**: The following example shows how to connect a component to the Redux store:
  ```tsx
  const enhancer = connect((state: { dashboardReducer: DashboardState }) => ({
    dashboardData: state.dashboardReducer?.getWidgets,
  }))(index);
  ```

- **Using Async State**: The `DashboardState` interface defines how to manage loading states and data:
  ```typescript
  export interface DashboardState {
    getWidgets: AsyncState<GetWidgetsResponse["widgets"]> | null | undefined;
  }
  ```

## Conclusion
This document serves as a foundational guide for AI coding agents to navigate and contribute effectively to the Free-for-Service UI project. For further details, refer to the [Next.js Documentation](https://nextjs.org/docs) and the project's README.
