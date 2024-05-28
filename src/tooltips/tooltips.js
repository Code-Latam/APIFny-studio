const tooltips = {
    username: {
      content: "Enter your unique username.",
      isHtml: false  
    },
    clientNr: {
        content: "A unique identifier for the GWOCU studio client, usually supplied to you when you become a client or are invited to a workspace.",
        isHtml: false  
      },
    gwoken: {
        content: "A unique identifier used to digitally sign your access, usually supplied to you when you become a client or are invited to a workspace.",
        isHtml: false  
      },
    chatbotKey: {
        content: "A unique identifier for the master chatbot of a client, usually supplied to you when you become a client or are invited to a workspace.",
        isHtml: false  
      },
    workspace: {
        content: `<strong>A unique identifier for the workspace you have been assigned to.</strong>
        <br>
        <strong>The workspace is usually:</strong>
        <ul>
          <li>Assigned to you when you become a client.</li>
          <li>Assigned to you when you are invited by an owner of a workspace.</li>
        </ul>
        <p>You can be a member of multiple workspaces!</p>`,
        isHtml: true 
      },
    password: {
        content: `<strong>Please use the password you supplied to us at your first invitation.</strong>
                <br>
                <strong>Password Requirements:</strong>
                <ul>
                  <li>At least 8 characters long.</li>
                  <li>No spaces.</li>
                  <li>Contains uppercase and lowercase letters.</li>
                  <li>Includes at least two numbers and symbols.</li>
                </ul>`,
      isHtml: true  // HTML content
    },
    email: {
      content: "The email that is used to identify you as a user, usually the email that was used during client registration or when you were sent an invite.",
      isHtml: false  // Plain text
    },
    // left panel help
    mainMenu: {
        content: "Main Menu of the Studio.",
        isHtml: false
    },
    leftPanel: {
        content: `
        <p>The product tree panel is used to manage products and workflows. It supports the addition, removal and editing of products and workflows. A product can be seen as as a collection of workflows. A workflow can be seen as a collection of tasks that follow each other in a certain sequence. Our workflows are organized as Directed Acyclic Graphs (DAG). A DAG is a directed graph that has no cycles. This means it consists of nodes (in our case tasks) and links, with each node directed from one node to another, by the link. You cannot traverse the graph and return to the same node by following the directions of the links.
        In simpler terms, a DAG is a way to represent relationships or dependencies where everything moves in one direction and there are no loops—once you move forward, you can’t go back to where you started within the graph.
        </p> 
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Adding Products</h3>
        <p>Use the Add Product button to add products. This is the first step needed to create a workflow of APIs. A product can have multiple workflows. You can start documenting your product immediately at creation or later when you have more information. Products that are added will appear automatically in this panel.</p>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Adding Workflows</h3>
        <div>
            Use the Add Workflow button to add workflows. You first need a product before you can add workflows. Workflows that are added will appear automatically in this panel.
            <br>
            <strong>Characteristics:</strong>
            <ul>
                <li>You can have multiple workflows per product.</li>
                <li>Once you have added a workflow, you can add tasks and links to it and create your workflow graph.</li>
                <li>You can start documenting your product immediately at creation or later when you have more information.</li>
            </ul>
        </div>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Adding APIs</h3>
        <div>
            Use the All API's button to manually add API calls that you will use in your workflows.
            <br>
            <ul>
                <li>You can also use the 'Import API Definition' option in the context Menu of this panel to import API definitions from POSTMAN or OpenAPI (SWAGGER).</li>
                <li>If needed, make sure you use the configuration section of the Main Menu to configure globals or authentication for your APIs.</li>
            </ul>
        </div>
    </section>`,
        isHtml: true
        },
    // Center Panel Help
    centerPanel: {
        content: `<section>
        <p>The workflow graph panel is used to detail out the workflow in a product. You must have previously created a product and a workflow in the product tree panel. In this panel you can add tasks (nodes) and links to further detail out the workflow. Please remember your workflows must be organized as Directed Acyclic Graphs (DAGs). A DAG is a directed graph that has no cycles. </p>
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Adding Tasks to Workflow</h3>
        <div>
            <strong>Use the Add Task button to add tasks to the workflow graph area.</strong>
            <br>
            <ul>
                <li>Select a workflow before trying to add a task. Once selected, you can add multiple tasks.</li>
                <li>After creating a task, you can move it around and connect it to other tasks using the 'Add Link' button.</li>
                <li>You can edit all the tasks' properties by selecting it and using the properties panel on the right.</li>
                <li>Once you have selected a task, you can use the right panel menu to execute multiple options depending on the task type.</li>
            </ul>
        </div>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Removing Tasks from Workflow</h3>
        <div>
            <strong>Use the Remove Task button to remove tasks from the graph area below.</strong>
            <br>
            <ul>
                <li>Select a workflow before trying to remove a task.</li>
                <li>Once you remove a task, all data belonging to it will be lost.</li>
                <li>When you remove a task, all links connecting to it, along with all data belonging to those links, will also be lost.</li>
            </ul>
        </div>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Adding Links Between Tasks</h3>
        <div>
            <strong>Use the Add Link button to add a link to the graph area below.</strong>
            <br>
            <ul>
                <li>Select a workflow before trying to add a link. Once selected, you can add multiple links.</li>
                <li>When creating a link, you will be asked to indicate the two tasks you want to connect.</li>
                <li>A link cannot connect in a circular fashion and cannot be connected to the same task.</li>
                <li>The link arrow must flow in one direction.</li>
                <li>Using links, you are not allowed to create a cyclical graph.</li>
                <li>Only a finite, directed graph with no directed cycles is allowed.</li>
            </ul>
        </div>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Removing Links from Workflow</h3>
        <div>
            <strong>Use the Remove Link button to remove links from the graph area below.</strong>
            <br>
            <ul>
                <li>Select a link before trying to remove it.</li>
                <li>Once you remove a link, all data belonging to it will be lost.</li>
            </ul>
        </div>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Saving Workflow Graph as Image</h3>
        <div>
            <strong>Use Save Image button to save the workflow graph as an image.</strong>
            <br>
            <ul>
                <li>Images can be downloaded in various formats like SVG and PNG.</li>
                <li>The image will be downloaded directly to your device and will be ready for subsequent use.</li>
            </ul>
        </div>
    </section>`,
        isHtml: true
        },
        // Export Products
    exportProducts: {
        content: `<h3 style="margin-bottom: 10px; margin-top: 10px";>Setting Up Your Export</h3>
        <ol>
            <li><strong>File Name</strong>: Enter the desired name for your exported file in the 'File Name' input box. This name will be prefixed to the exported file.</li>
            <li><strong>Version</strong>: Specify the version of the export in the 'Version' input box.</li>
        </ol>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Selecting Products to Export</h3>
        <ol>
            <li><strong>Export All Products</strong>: Check the box labeled 'Export all Products or choose below' if you wish to export all products. This will automatically select all available products.</li>
            <li><strong>Select Individual Products</strong>: If you do not wish to export all products, uncheck the 'Export all Products' checkbox and use the dropdown menu to select individual products. You can select multiple products by holding the <code>Ctrl</code> key (or <code>Cmd</code> on macOS) while clicking.</li>
        </ol>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Exporting Data</h3>
        <ol>
            <li>Once you have configured the export settings and selected the desired products, click the "Export" button. This will generate a <code>.yaml</code> file containing the data of the selected products along with their associated workflows, tasks, links, and APIs.</li>
            <li>The exported file will be downloaded automatically to your device. The file format will be <code>[FileName]-[Version].yaml</code>.</li>
        </ol>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Closing the Interface</h3>
        <ol>
            <li>To close the interface, click the "Close" button located at the bottom of the dialog.</li>
        </ol>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Additional Uses of the Export Feature</h3>
        <ul>
            <li><strong>Version Control</strong>: Use the export function to maintain versions of your workspace configurations, allowing you to track changes over time and revert to previous versions if necessary.</li>
            <li><strong>Backup and Restore</strong>: Regular exports can serve as backups for your data. In case of data loss or corruption, these exports can be used to restore your workspace to a previous state.</li>
            <li><strong>Exporting and Importing Workflows</strong>: Exported files can be used to transfer workflows and other configurations between different workspaces, facilitating easy replication of settings and data across multiple environments.</li>
        </ul>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Troubleshooting</h3>
        <ul>
            <li>If you encounter any issues with fetching data or exporting the file, check your internet connection and try again.</li>
            <li>Ensure JavaScript is enabled in your browser to use all functionalities of the interface.</li>
        </ul>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>File Format and Content</h3>
        <p>The exported file will be in YAML format. It includes detailed information about each selected product, workflows, tasks, links, and APIs as configured in the interface.</p>
        
        <p>For further assistance or technical support, please contact the support team or refer to the help documentation provided with your application.</p>`,
        isHtml: true
        },
        // send invitation menu
        sendInvitationMenu: {
            content: `Use this menu to send an invitation to this workspace, using a thirdparty's email.`,
            isHtml: false
            },
        // Send Invitation Screen
        invitation: {
            content: `<h3 style="margin-bottom: 10px; margin-top: 10px";>Send Invitation Overview</h3>
            
            <p>This dialogue allows you to send invitations to third parties to join your workspace. Invitations can be assigned one of three authorization levels depending on the required access:</p>
            
            <h3 style="margin-bottom: 10px; margin-top: 10px";>Owner Authorization</h3>
            
            <ul>
              <li><strong>Capabilities:</strong> Owners have full administrative rights, including adding or deleting workspaces, modifying settings, and managing all aspects of the workspace.</li>
              <li><strong>Note:</strong> Only grant this role when absolutely necessary, as it allows significant changes, including the potential deletion of the workspace.</li>
            </ul>
            
            <h3 style="margin-bottom: 10px; margin-top: 10px";>Designer Authorization</h3>
            
            <ul>
              <li><strong>Capabilities:</strong> Designers possess comprehensive capabilities within the workspace, except for adding or deleting workspaces.</li>
              <li><strong>Typical Use:</strong> Suitable for users who need to create, edit, and manage products, workflows, and APIs but do not need control over workspace settings.</li>
            </ul>
            
            <h3 style="margin-bottom: 10px; margin-top: 10px";>Reader Authorization</h3>
            
            <ul>
              <li><strong>Capabilities:</strong> Readers can execute APIs and workflows, make exports, and view all workspace content. However, they cannot modify products, workflows, or APIs.</li>
              <li><strong>Typical Use:</strong> Ideal for users who require access to data and functionalities without the need to alter configurations or setups.</li>
            </ul>
            
            <h3 style="margin-bottom: 10px; margin-top: 10px";>Invitation and Security Details</h3>
            
            <p>Invitations are sent via email, accompanied by a secure, encrypted token that expires in 5 days. If necessary, you can delete an invitation using the invitation pending list available in the menu. This feature allows for the cancellation of an invitation if plans change.</p>
            `,
            isHtml: true
            },
     //Users
     usersroles: {
        content: `<h3 style="margin-bottom: 10px; margin-top: 10px";>User Roles and Permissions</h3>
        <h3 style="margin-bottom: 10px; margin-top: 10px";>User Onboarding</h3>
            <p>Once an individual has been invited and accepts the invitation, they become a user of the system. Users can then be granted access to additional workspaces, with specific roles assigned within each workspace.</p>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Owner Permissions</h3>
            <p>Owners hold full administrative rights, which include the ability to add or delete workspaces, modify settings, and manage all aspects of the workspace. This role should only be assigned when absolutely necessary, as it provides significant power over the system, including the potential for deleting the entire workspace.</p>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Designer Authorization</h3>
            <p>Designers have comprehensive capabilities within the workspace, excluding the addition or deletion of workspaces. This role is suitable for users who need to create, edit, and manage products, workflows, and APIs but do not require control over workspace settings.</p> 
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Reader Permissions</h3>
            <p>Readers can execute APIs and workflows, make exports, and view all content within the workspace. However, they are not permitted to modify products, workflows, or APIs. This role is ideal for users who require access to data and functionalities without the need to alter configurations or setups.</p>
        `,
        isHtml: true
        },
     usersMenu: {
        content: `Use this menu to manage roles for users that have accepted an invitation.`,
        isHtml: false
        },
    deleteUser: {
        content: `click to delete user`,
        isHtml: false
        },
    editUser: {
        content: `click to edit user`,
        isHtml: false
        },
        // Import Products
        importProducts: {
            content: `<h3 style="margin-bottom: 10px; margin-top: 10px";>File Upload</h3>
            <p>Click on the file input field marked "Choose File".</p>
            <p>Select the YAML file that you previously exported or that contains the structured data according to the schema used by your workspace. This file should have a <code>.yaml</code> extension.</p>
            
            <h3 style="margin-bottom: 10px; margin-top: 10px";>Important Notice</h3>
            <p>Existing Products with the same name will NOT be overwritten! This means that if the file you are importing contains products that already exist in the database, these entries will be skipped to prevent duplication or data loss.</p>
            
            <h3 style="margin-bottom: 10px; margin-top: 10px";>Importing Data</h3>
            <ol>
                <li>After selecting the file, click the "Import" button to begin the process.</li>
                <li>The system will read the file and begin importing data. Products, workflows, tasks, links, and APIs will be processed. Existing products with the same name will not be overwritten; instead, they will be ignored.</li>
                <li>The system ensures that related data such as workflows, tasks, and links are only imported if their associated products are successfully imported or already exist.</li>
                <li>An alert will pop up to notify you when the import process is complete.</li>
            </ol>
            
            <h3 style="margin-bottom: 10px; margin-top: 10px";>Closing the Interface</h3>
            <ol>
                <li>To close the interface, either click the "Close" button at the bottom of the dialog or the "×" at the top-right corner of the interface.</li>
            </ol>
            
            <h3 style="margin-bottom: 10px; margin-top: 10px";>Troubleshooting</h3>
            <ul>
                <li>Ensure that the file is in the correct YAML format and adheres to the expected schema.</li>
                <li>If the import process fails or does not start, check the console for errors, ensure that the file is not corrupt, and that it follows the specified format.</li>
                <li>If the import does not complete, verify your internet connection and try again.</li>
            </ul>
               
            <p>For further assistance or technical support, please contact your system administrator or refer to the help documentation provided with your application. This manual serves as a guideline for importing data and might need adjustments based on specific system configurations or updates.</p>`,
            isHtml: true
            },
    thirdparties: {
        content: `
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Overview</h3>
        <p>This interface allows users to manage third-party records associated with a client. Users can add, update, or delete records, as well as navigate through existing entries. Third parties are particularly useful when needing to integrate external APIs that are not part of the user's own backend or have different authentication methods.</p>
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Importance of Third Parties</h3>
        <p>A third party is required when you need to incorporate external APIs into your workflows. These are APIs that are not hosted on your own backend and may have different authentication methods. Each third party added can have its own authentication details specified in a YAML configuration file, facilitating secure and efficient API integrations.</p>
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Adding a New Third Party</h3>
        <p>To add a new third-party record, fill in the client number, name, description, and YAML data in the respective fields in the form. Once all fields are completed, click the "Add" button to register the new third party.</p>
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Updating an Existing Third Party</h3>
        <p>Select an existing third-party record from the table by clicking on it. The selected record's details will be loaded into the form. Make any necessary changes and click the "Update" button to save the changes.</p>
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Deleting a Third Party</h3>
        <p>With a third-party record selected, click the "Delete" button to remove the record from the system. This action is irreversible.</p>
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Navigating Records</h3>
        <p>The table displays all third-party records associated with the main client. Click on any record to select it and view or modify its details in the form.</p>
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Form Fields</h3>
        <ul>
            <li><strong>Client Number:</strong> Unique identifier for the client. This field is auto-filled when updating records.</li>
            <li><strong>Name:</strong> Name of the third party.</li>
            <li><strong>Description:</strong> Brief description of the third party.</li>
            <li><strong>YAML:</strong> YAML configuration data for the third party. This field is crucial for defining the authentication method and other configurations necessary for API integration.</li>
        </ul>
 
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Closing the Interface</h3>
        <p>Click the "Close" button to exit the management interface at any time.</p>
    `,
        isHtml: true
        },
    // Import API Definitions
    importApiDefinitions: {
        content: `
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Import Api Definitions</h3>
        <p>The interface supports uploading of two specific file types into the current workspace:</p>
        <ol>
            <li><strong>Postman Collections (v2.1)</strong>: Used for uploading collections exported from Postman.</li>
            <li><strong>Swagger OpenAPI Definitions (v3.0)</strong>: Used for uploading Swagger API definitions.</li>
        </ol>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>How to Upload Files</h3>
        <ol>
            <li>Click on the respective label for the type of file you want to upload (Postman or Swagger).</li>
            <li>A file dialog will open. Select the file you wish to upload and confirm your choice.</li>
            <li>Once a file is selected, a confirmation dialog will appear, asking if you are sure you want to proceed with the upload.</li>
            <li>If there are API definitions with the same name already in the system, the uploaded file will overwrite them.</li>
            <li>Click 'Proceed' to start the upload or 'Cancel' to abort the process.</li>
        </ol>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Monitoring Upload Progress</h3>
        <p>After initiating the upload, a progress bar will display the current progress of the upload process. This helps you monitor the upload status and ensures that your file is being processed.</p>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Troubleshooting</h3>
        <ul>
            <li>If you are importing a Swagger file (OpenAPI) make sure the file does not contain external references. The file must be completely self contained.</li>
            <li>Test you swagger file for correctness using <a href="https://editor.swagger.io/" target="_blank">the Swagger editor</a>.</li>
            <li>If the upload fails, check your network connection and ensure that the file format is correct (either Postman v2.1 or Swagger v3.0).</li>
            <li>Ensure that the file size does not exceed the limits specified by your platform's guidelines.</li>
            <li>If problems persist, contact technical support for assistance.</li>
        </ul>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Closing the Interface</h3>
        <p>To exit the upload interface, simply navigate away from the page or close your browser tab.</p>
        <p>For further assistance or technical support, please refer to the help documentation provided with your application or contact your system administrator.</p>
        `,
        isHtml: true
        },
    // workspaces

    workspaces: {
        content: `
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Overview</h3>
        <p>Create and manage workspaces within the platform. Workspaces are dedicated areas where users can create API definitions, import data, develop custom products, and design workflows specific to their needs.</p>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Creating Workspaces</h3>
        <p>To begin, navigate to the workspaces section of your platform. Here, you can create a new workspace by selecting the 'Create Workspace' option. You can name the workspace according to your preference.</p>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Customizing Your Workspace</h3>
        <p>Within each workspace, you have the flexibility to:</p>
        <ul>
            <li>Create and define API definitions.</li>
            <li>Import existing API definitions from external sources.</li>
            <li>Develop and manage custom products tailored to your operational needs.</li>
            <li>Design and implement workflows that streamline your processes.</li>
        </ul>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Inviting Users and Assigning Roles</h3>
        <p>Workspaces support collaborative efforts by allowing you to invite others to join. You can assign appropriate roles to each user, enhancing security and operational efficiency:</p>
        <ul>
            <li><strong>Readers:</strong> Can access and execute APIs and workflows, and participate in training chatbots.</li>
            <li><strong>Designers and Owners:</strong> Have permissions to create and manage APIs, products, and workflows. They can also train chatbots and adjust workspace-specific settings.</li>
        </ul>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Exporting and Importing Workspace Data</h3>
        <p>You can export products and workflows from one workspace to another using the platform's export feature, which generates a YAML file specific to each workspace. This file can also be used to define workspace-specific authentication methods.</p>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Enhancing Workspace with Chatbots</h3>
        <p>Each workspace is equipped with two chatbots, designed to assist different user roles:</p>
        <ul>
            <li><strong>Reader Chatbot:</strong> Trained to provide support and information to readers.</li>
            <li><strong>Designer/Owner Chatbot:</strong> Trained to assist designers and owners with more complex queries and tasks.</li>
        </ul>
        <p>You can train these chatbots with documents specific to your workspace to enhance their effectiveness and relevance.</p>
        
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Security Considerations</h3>
        <p>Ensure that all activities within the workspace adhere to your organization’s security policies. This includes the management of sensitive information within API definitions and documents used for training chatbots.</p>
        
        <p>For further assistance or technical support, please consult the help documentation provided with the application or contact your system administrator.</p>
        `,
        isHtml:  true
        },
    deleteWorkspace: {
        content: `click to delete workspace`,
        isHtml: false
        },
    productDescription: {
        content: `<section>
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Product Selection and Display</h3>
        <p>When a product is clicked in the tree within the products-tree-panel or the "Description" option is selected in the context menu of this panel, its properties are displayed for viewing and editing. Editing capabilities are only allowed for users with owner or designer rights.</p>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Editing Product Properties</h3>
        <p>Initially, the description option is selected, displaying editable fields:</p>
        <ul>
            <li><strong>Status:</strong> Set this to either <em>public</em> or <em>private</em>. If set to <em>private</em>, only designers and owners can view the product. If set to <em>public</em>, the product is visible to all users in the product tree.</li>
            <li><strong>Sequence:</strong> A numeric value that determines the product's position in the product tree. For example, a sequence of 1 positions the product at the beginning of the tree.</li>
            <li><strong>Description:</strong> Use the rich text editor to modify the product's description. This editor supports links, block text, and other rich text features. Toggle to the markdown editor using the markdown button if preferred.</li>
        </ul>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Additional Options</h3>
        <p>Additional functions can be activated using the context icon in the top right of this panel:</p>
        <ul>
            <li><strong>Export to Open API:</strong> Exports all APIs associated with the product, including those in workflows. These can then be imported into tools like Postman or Swagger, or any third-party product that supports Open API specification files.</li>
            <li><strong>Compliance:</strong> Activates a dialogue to edit compliance information or directives applicable to the product. Compliance information can also be set at the workflow and task levels.</li>
        </ul>
    </section>`,
        isHtml: true
        },
    productComplianceDescription: {
        content: `<section>
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Product Compliance Selection and Display</h3>
        <p>When the "Compliance" option is selected in the context menu of this panel, its properties are displayed for viewing and editing. Editing capabilities are only allowed for users with owner or designer rights.</p>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Editing Product Compliance Properties</h3>
        <p>Initially, the editor will be displayed:</p>
        <ul>
            <li><strong>Compliance Description:</strong> Use the rich text editor to modify the product's compliance description. This editor supports links, block text, and other rich text features. Toggle to the markdown editor using the markdown button if preferred.</li>
        </ul>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Additional Options</h3>
        <p>Additional functions can be activated using the context icon in the top right of the this panel:</p>
        <ul>
            <li><strong>Export to Open API:</strong> Exports all APIs associated with the product, including those in workflows. These can then be imported into tools like Postman or Swagger, or any third-party product that supports Open API specification files.</li>
            <li><strong>Description:</strong> Activates a dialogue to edit general product information that is not compliance related. General information can also be set at the workflow and task levels.</li>
        </ul>
    </section>`,
        isHtml: true
        },
    // Workflow screens
    workflowDescription: {
        content: `<section>
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Workflow Selection and Display</h3>
        <p>When a workflow is clicked in the tree within the left panel or the "Description" option is selected in the context menu of this panel, its properties are displayed for viewing and editing. Editing capabilities are only allowed for users with owner or designer rights.</p>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Editing Workflow Properties</h3>
        <p>Initially, the description option is selected, displaying editable fields:</p>
        <ul>
            <li><strong>Status:</strong> Set this to either <em>public</em> or <em>private</em>. If set to <em>private</em>, only designers and owners can view the workflow. If set to <em>public</em>, the workflow is visible to all users in the product tree.</li>
            <li><strong>Sequence:</strong> A numeric value that determines the workflows's position in the product tree. For example, a sequence of 1 positions the workflow at the beginning of the workflow list in the product.</li>
            <li><strong>Description:</strong> Use the rich text editor to modify the workflow's description. This editor supports links, block text, and other rich text features. Toggle to the markdown editor using the markdown button if preferred.</li>
        </ul>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Additional Options</h3>
        <p>Additional functions can be activated using the context icon in the top right of this panel:</p>
        <ul>
            <li><strong>Run Workflow:</strong>This option will run all APIS associated with the workflow in sequence. Instructions are available at the interface.</li>
            <li><strong>Javascript Code:</strong>This option will display Javascript code that can potentially be used to run the API calls in the workflow using an IDE.</li>
            <li><strong>Python Code:</strong>This option will display Python code that can potentially be used to run the API calls in the workflow using an IDE.</li>
            <li><strong>Export to Open API:</strong> Exports all APIs associated with the workflow. These can then be imported into tools like Postman or Swagger, or any third-party product that supports Open API specification files.</li>
            <li><strong>Compliance:</strong> Activates a dialogue to edit compliance information or directives applicable to the workflow. Compliance information can also be set at the product and task levels.</li>
        </ul>
    </section>`,
        isHtml: true
        },
    workflowComplianceDescription: {
        content: `<section>
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Workflow Compliance Selection and Display</h3>
        <p>When the "Compliance" option is selected in the context menu of this panel, its properties are displayed for viewing and editing. Editing capabilities are only allowed for users with owner or designer rights.</p>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Editing Workflow Compliance Properties</h3>
        <p>Initially, the editor will be displayed:</p>
        <ul>
            <li><strong>Compliance Description:</strong> Use the rich text editor to modify the product's compliance description. This editor supports links, block text, and other rich text features. Toggle to the markdown editor using the markdown button if preferred.</li>
        </ul>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Additional Options</h3>
        <p>Additional functions can be activated using the context icon in the top right of this panel:</p>
        <ul>
                 <li><strong>Export to Open API:</strong> Exports all APIs associated with the workflow. These can then be imported into tools like Postman or Swagger, or any third-party product that supports Open API specification files.</li>
            <li><strong>Description:</strong> Activates a dialogue to edit general information applicable to the workflow. A general description can also be set at the product and task levels.</li>
        </ul>
    </section>`,
        isHtml: true
        },
    taskDescription: {
        content: `<section>
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Task Selection and Display</h3>
        <p>When a task is clicked in the graph within the central panel or the "Description" option is selected in the context menu of this panel, its properties are displayed for viewing and editing. Editing capabilities are only allowed for users with owner or designer rights.</p>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Editing Task Properties</h3>
        <p>Initially, the description option is selected, displaying editable fields:</p>
        <ul>
            <li><strong>Task Name:</strong> Initially the system generates a unique identifier for the name of the task, but the user can change this name to a more meaningful one.</li>
            <li><strong>Task Type:</strong> The user can set a task as type "normal" or "API". If task type API is selected then the sytem will treat the Task as an API call, subsequently the user can select the API to be called from the "Implements" field. The API definition must have been previously created using the All API's button, or by importing the API definition.</li>
            <li><strong>Node Type:</strong> The user may impart additional meaning to the task by choosing the shape of the node. The shape can be a circle, a diamond or any shape that is available in the dropdown list.</li>
        </ul>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Additional Options</h3>
        <p>Additional functions can be activated using the context icon in the top right of this panel:</p>
        <ul>
            <li><strong>Curl:</strong>This option is only available if the task type is an API, and when activated will enable the user to call the API directly using the default or custom parameters.</li>
            <li><strong>Javascript Code:</strong>This option is only available if the task type is an API, and when activated will display Javascript code that can potentially be used to run the API call using an IDE.</li>
            <li><strong>Python Code:</strong>This option is only available if the task type is an API, and when activated will display Python code that can potentially be used to run the API call using an IDE.</li>
            <li><strong>Export to Open API:</strong> This option is only available if the task type is an API, and when activated will export the API definition associated with the task. The definition can then be imported into tools like Postman or Swagger, or any third-party product that supports Open API specification files.</li>
            <li><strong>Compliance:</strong> Activates a dialogue to edit compliance information or directives applicable to the task. Compliance information can also be set at the product and workflow levels.</li>
        </ul>
    </section>`,
        isHtml: true
        },
    taskComplianceDescription: {
        content: `<section>
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Compliance Description Selection and Display</h3>
        <p>When the "Compliance Description" option is selected in the context menu of this panel, its properties are displayed for viewing and editing. Editing capabilities are only allowed for users with owner or designer rights.</p>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Editing Compliance Product Properties</h3>
        <p>Initially, the editor will be displayed:</p>
        <ul>
            <li><strong>Compliance Description:</strong> Use the rich text editor to modify the task's compliance description. This editor supports links, block text, and other rich text features. Toggle to the markdown editor using the markdown button if preferred.</li>
        </ul>
    </section>

    <section>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Additional Options</h3>
        <p>Additional functions can be activated using the context icon in the top right of this panel:</p>
        <ul>
            <li><strong>Curl:</strong>This option is only available if the task type is an API, and when activated will enable the user to call the API directly using the default or custom parameters.</li>
            <li><strong>Javascript Code:</strong>This option is only available if the task type is an API, and when activated will display Javascript code that can potentially be used to run the API call using an IDE.</li>
            <li><strong>Python Code:</strong>This option is only available if the task type is an API, and when activated will display Python code that can potentially be used to run the API call using an IDE.</li>
            <li><strong>Export to Open API:</strong> This option is only available if the task type is an API, and when activated will export the API definition associated with the task. The definition can then be imported into tools like Postman or Swagger, or any third-party product that supports Open API specification files.</li>
            <li><strong>Description:</strong> Activates a dialogue to edit general information applicable to the task. General information can also be set at the product and workflow levels.</li>
        </ul>
    </section>`,
        isHtml: true
        },

    curlExecution: {
        content: `<h3 style="margin-bottom: 10px; margin-top: 10px";>Curl Execution</h3>
        <p>The Curl Menu Item will be displayed when a task is selected and the task has an API definition associated with it. The API Terminal component allows users to interact with an API directly from a terminal interface. Users can edit API routes and request bodies, save custom configurations, restore to default settings, and execute API requests. Note that the API call displayed is the default definition of the API call as found in the "ALL  APIS " section of the Studio. API definitions can be created form scratch or imported using the "Import Api Definitions" menu item in the product tree panel menu. </p>   
        <p><strong>Usage Instructions</strong></p>
        <p>To use the API Terminal, follow these steps:</p>
        <ol>
            <li><strong>Saving API Settings:</strong> Customize your API request parameters and click the 'Save' button to store these settings.</li>
            <li><strong>Restoring Default Settings:</strong> To revert to the original API settings, click the 'Restore Default' button.</li>
            <li><strong>Executing API Requests:</strong> Enter commands into the terminal to interact with the API. Supported commands include:</li>
            <ul>
                <li><code>run</code> - Executes the API call and displays the response in a formatted JSON view.</li>
                <li><code>clear</code> - Clear the execution window</li>
            </ul>
        </ol>
    
        <p><strong>Editing API Parameters<strong></p>
        <p>You can edit the following API parameters directly in the terminal interface:</p>
        <ul>
            <li>API Route: Modify the API endpoint route by editing the text area with the route information.</li>
            <li>Request Body:  Adjust request body fields using the provided text areas for each parameter.</li>
        </ul>
    
        <p><strong>Error Handling</strong></p>
        <p>If there is an error during the API execution or during the save and restore operations, the terminal will display an error message. Ensure the input format and data are correct before retrying.</p>
        <p><strong>Additional Features</strong></p>
        <p>The component includes tooltips and a help icon for additional information and compliance guidelines related to the task.</p>`,
        isHtml: true
        },

    linkView: {
        content: `<h3 style="margin-bottom: 10px; margin-top: 10px";>Link Selection and Display</h3>
        <p>The Linkview interface allows users with appropriate permissions (designers or owners) to update links, manage parameters, and configure link types between tasks in a workflow.</p>
<br>
    
<h3 style="margin-bottom: 10px; margin-top: 10px";>Updating a Link</h3>
        <p>To update a link's properties:</p>
        <ol>
            <li>Ensure that you have selected a workflow and a link within that workflow.</li>
            <li>If authorized, use the 'Update' button to save changes made to the link.</li>
        </ol>
    
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Managing Link Parameters</h3>
        <p>Link parameters define the data that is passed between tasks. These include:</p>
        <ul>
            <li><strong>Resource and Path Parameters:</strong> These parameters are part of the URL path of the API call.</li>
            <li><strong>Query Parameters:</strong> These parameters are appended to the URL of the API call.</li>
            <li><strong>Request Body Parameters:</strong> These parameters are included in the body of the POST request.</li>
        </ul>
        <p>To edit any of these parameters, use the corresponding JSON editor provided in the interface. A task in a workflow of the gwocu studio can have multiple links pointing to it. If <strong>Pass following Parameters to target API..</strong>  is checked the studio will pass the parameters defined in the link to the task. If it is checked for more than one link all the parameters of every link checked will be combined and passed to the task. Consequently when executing the Curl in the workflow or when running the workflow, if the task is an API call (colored blue) the url and requestbody will be changed according to the values of these parameters passed through the links. The <strong>sequence</strong> input field indicates the sequence in which the links will be procesessed if there is more than one link pointing to a task. This is important in the case of processing Source and Path Parameters as the order is important to target the correct resources.</p>
<br>
  <p>Whenever {{parameterName}} is used in one of the parameter fields, as shown in the examples below, the studio will search for the value of parameterName in the response body of the API that serves as the source task for the link. It will replace {{parameterName}} with the corresponding value from the response. Note that in {{parameterName}} parameterName can be any property name from the response. Refer to the examples below for further clarification.</p>
				
  <h3 style="margin-bottom: 10px; margin-top: 10px";>Resource and Path Parameters</h3>
    <p>
        In the context of API design, <strong>Resource Parameters</strong> refer to the static parts of an API URL that define the type or collection of resources, whereas <strong>Path Parameters</strong> refer to the variable parts of the API URL that specify particular instances of those resources. In the studio environment, both are combined into a single object called "Resource and Path Parameters." The order in which these parameters are presented is dictated by the studio field "Path Order."
    </p>
    
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Example</h3>
    <p>Given a GWOCU studio JSON formatted input for Resource and Path Parameters:</p>
    <pre>
<code>
{
    "userResource": "users",
    "userId": "{{userId}}", // note the studio will search for the value of this property in the resultbody of the executed source task.
    "languageResource": "language",
    "languageId": "Dutch"
}
</code>
    </pre>
    
    <p>And a Path Order input of:</p>
    <pre>
<code>
["userResource", "userId", "languageResource", "languageId"]
</code>
    </pre>

<p>And a Result Body of a previously executed API:</p>
    <pre>
<code>
{
    result: {
    "userId": "1234"
}
</code>
    </pre>
  <p> note: the previously executed API must be the source task of the link that is under consideration. The source task must have an API that is associated with it and it must have been previously executed in the curl view of the task. </p>
    
    <p>With a base URL of:</p>
    <pre>
<code>https://example.com</code>
    </pre>
    
    <p>The constructed URL for a GET API request would be:</p>
    <pre>
<code>GET https://example.com/users/1234/language/Dutch</code>
    </pre>
    
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Task Affected</h3>
    <p>
        Note that the task that will be affected by setting these parameters is the task to where the link is pointed to, but only if it is an API task (colored blue). The Base URL for this API can be set in the "All APIs" section within the Studio. You can find this API there and change the Base Url value if needed. If there are other links pointing to the task and they are allowed to pass parameters then the Source and Path Parameters will be combined.
    </p>


    <h3 style="margin-bottom: 10px; margin-top: 10px";>Query Parameters</h3>
    <p>
        <strong>Query Parameters</strong> are a way to pass additional information to an API endpoint. They are appended to the end of the URL after a <code>?</code> and are used to filter, sort, or specify additional options for the request. Each parameter is a key-value pair, and multiple parameters are separated by an <code>&</code>.
    </p>
    <p>Query parameters are commonly used in GET requests to refine the data that is being requested from the server.</p>
    
    <h3>Example with Query Parameters</h3>
    <p>Using the previously constructed URL example for Resource and Path Parameters, let's expand it to include query parameters.</p>
    
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Base URL with Resource and Path Parameters:</h3>
    <pre><code>https://example.com/users/1234/language/Dutch</code></pre>
    
    <p>Now, suppose we want to add query parameters to filter results by date and sort them by name. The query parameters might look like this in the studio:</p>
		 <pre>
<code>
{
    "date": "2024-05-27",
    "sort": "name"
}
</code>
    </pre>
     <p>this will result in a generated query parameter string like: </P
    <pre><code>?date=2024-05-27&sort=name</code></pre>
    
    <h4>And the complete URL with Query Parameters would be:</h4>
    <pre><code>GET https://example.com/users/1234/language/Dutch?date=2024-05-27&sort=name</code></pre>
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Task Affected</h3>
    <p>
        Note that the task that will be affected by setting these parameters is the task to where the link is pointed to, but only if it is an API task (colored blue). If there are other links pointing to the task and they are allowed to pass parameters then the query parameters will be combined.
    </p>
    <br>
  <p>Again you may choose to use a property value of a previously executed API in the workflow by using "{{property name}} in the query parameter object. for instance: </p>

 <pre>
<code>
{
    "date": "2024-05-27",
    "sort": {{"name"}}
}
</code>
    </pre>

  
  
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Request Body Parameters</h3>
    <p>
        <strong>Request Body Parameters</strong> are used to send data to the server in the body of the HTTP request. This is common with <code>POST</code>, <code>PUT</code>, and <code>PATCH</code> requests. The data is typically sent in JSON format.
    </p>
    <p>Request Body Parameters are used when you need to send more complex data structures to the server.</p>
    
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Example with Request Body Parameters</h3>
    <p>Continuing with the context of our previous examples, let's consider creating a new user language preference using a POST request.</p>
    
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Base URL:</h3>
    <pre><code>https://example.com/users/1234/language</code></pre>
    
    <p>Suppose we want to add a new language preference for the user with ID <code>1234</code>. The request body might look like this:</p>
    <pre><code>
{
    "language": "Dutch",
    "level": "Intermediate"
}
</code></pre>
    
<h3 style="margin-bottom: 10px; margin-top: 10px";>Complete Request with Request Body</h3>
    <pre><code>POST https://example.com/users/1234/language HTTP/1.1
Host: example.com
Content-Type: application/json

{
    "language": "Dutch",
    "level": "Intermediate"
}
</code></pre>
   
<h3 style="margin-bottom: 10px; margin-top: 10px";>Task Affected</h3>
    <p>
        Note that the task that will be affected by setting these parameters is the task to where the link is pointed to, but only if it is an API task (colored blue). The Base URL for this API can be set in the "All APIs" section within the Studio. You can find this API there and change the Base Url value if needed. If there are other links pointing to the task and they are allowed to pass parameters then the Request Body Parameters will be combined.
    </p>
    
    <h3 style="margin-bottom: 10px; margin-top: 10px";>Link Type Configuration</h3>
        <p>The type of link can be selected from the options provided, which affect the visual representation and behavior of the link in the workflow graph:</p>
        <ul>
            <li>STRAIGHT</li>
            <li>CURVE_SMOOTH</li>
            <li>CURVE_FULL</li>
        </ul>
    
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Changing Source and Target Tasks</h3>
        <p>If you need to change the source and target tasks of a link, you must delete the current link and create a new one. Use the 'Remove Link' and 'Add Link' buttons located in the central panel to perform these actions.</p>
    
        <h3 style="margin-bottom: 10px; margin-top: 10px";>General Usage Tips</h3>
        <ul>
            <li>Changes in the interface will not be saved until the 'Update' button is clicked.</li>
            <li>Ensure all JSON fields are valid before attempting to save changes.</li>
            <li>Use the source and target fields to understand the direction and endpoints of the link.</li>
        </ul>
    
        <h3 style="margin-bottom: 10px; margin-top: 10px";>Important Considerations</h3>
        <p>Always ensure that changes made are necessary and accurate, as modifying link parameters and types can significantly impact the behavior of the workflow.</p>`,
        isHtml: true
        },
  };

  export default tooltips;
  