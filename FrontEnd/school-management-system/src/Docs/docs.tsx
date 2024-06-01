import React from "react";
import styles from "./docs.module.css";
import { DocsRSB } from "./docs_rsb";

export function Docs(){
  return (
    <>
    <div className={styles.heading}>
      <h1>Docs</h1>
      <p>Welcome to the documentation for MySoftware. This document provides an overview of the features and usage of MySoftware.</p>

      <div>
      <h1>Session Management Module</h1>
      
      <p>
        The Session Management Module is a crucial component of our school management system. It plays a pivotal role in organizing and managing academic sessions, providing seamless user experiences, and enhancing overall administrative efficiency.
      </p>

      <h3>1. Academic Year Management</h3>
      <p>
        The module allows administrators to define academic years, set start and end dates, and manage the transition from one academic year to the next. This ensures that all academic activities are well-structured and follow a defined timeline.
      </p>

      <h3>2. Course and Class Scheduling</h3>
      <p>
        Schools can easily create and manage course schedules for each academic session. Class allocation, teacher assignments, and room bookings can all be efficiently handled within the system. This eliminates scheduling conflicts and optimizes resource allocation.
      </p>

      <h3>3. Student Enrollment</h3>
      <p>
        The module simplifies the process of enrolling students into courses and classes for the upcoming session. It provides a streamlined interface for adding new students, transferring existing ones, and updating student records.
      </p>

      <h3>4. Fee Management</h3>
      <p>
        Fee structures for each academic session can be defined, and the module automates fee collection and tracking. It sends notifications to parents and guardians for payment reminders, reducing the burden on administrative staff.
      </p>

      <h3>5. Report Generation</h3>
      <p>
        Comprehensive reports and analytics for student performance, attendance, and other academic metrics can be generated for each session. These reports help educators make data-driven decisions and track progress over time.
      </p>

      <h3>6. Data Archiving</h3>
      <p>
        Old academic sessions can be archived, keeping the system clutter-free while retaining historical data for reference and compliance purposes.
      </p>

      <h3>7. Streamlined Communication</h3>
      <p>
        The module facilitates communication between the school, students, and parents. Notifications about important events, progress updates, and announcements are sent automatically, ensuring everyone stays informed.
      </p>

      <h3>8. Regulatory Compliance</h3>
      <p>
        Session Management helps schools adhere to regulatory requirements by ensuring that academic sessions are well-documented and structured, making audits and inspections smoother.
      </p>

      <h2>Conclusion</h2>

      <p>
        In conclusion, the Session Management Module is an indispensable part of our school management system, providing a wide range of benefits for schools, administrators, teachers, students, and parents. It streamlines academic operations, enhances communication, and ensures compliance, ultimately contributing to a more efficient and effective educational institution.
      </p>
    </div>
     <p>
       Import MySoftware
       When an instance is stopped, the instance performs a normal shutdown, and then transitions to a stopped state. All of its Amazon EBS volumes remain attached, and you can start the instance again at a later time.
        You are not charged for additional instance usage while the instance is in a stopped state. A minimum of one minute is charged for every transition from a stopped state to a running state. If the instance type was changed while the instance was stopped, you will be charged the rate for the new instance type after the instance is started. All of the associated Amazon EBS usage of your instance, including root device usage, is billed using typical Amazon EBS prices.
        When an instance is in a stopped state, you can attach or detach Amazon EBS volumes. You can also create an AMI from the instance, and you can change the kernel, RAM disk, and instance type.
        Terminate an instance
        When an instance is terminated, the instance performs a normal shutdown. The root device volume is deleted by default, but any attached Amazon EBS volumes are preserved by default, determined by each volume's deleteOnTermination attribute setting. The instance itself is also deleted, and you can't start the instance again at a later time.
        To prevent accidental termination, you can disable instance termination. If you do so, ensure that the disableApiTermination attribute is set to true for the instance. To control the behavior of an instance shutdown, such as shutdown -h in Linux or shutdown in Windows, set the instanceInitiatedShutdownBehavior instance attribute to stop or terminate as desired. Instances with Amazon EBS volumes for the root device default to stop, and instances with instance-store root devices are always terminated as the result of an instance shutdown.
     </p>

      <h2>Features</h2>
      <ul>
        <li>Feature 1: Lorem ipsum dolor sit amet.</li>
        <li>Feature 2: Consectetur adipiscing elit.</li>
        <li>Feature 3: Sed do eiusmod tempor incididunt.</li>
      </ul>

      <h2>API Reference</h2>
      <p>Here are the main API methods of MySoftware:</p>
      <ul>
        <li><code>run()</code>: Start MySoftware.</li>
        <li><code>stop()</code>: Stop MySoftware.</li>
        <li><code>configure(options)</code>: Configure MySoftware with options.</li>
      </ul>

      <h2>Examples</h2>
      <p>Here's an example of using MySoftware:</p>
      <pre>
        <code>
          import MySoftware from 'mysoftware';
          const myInstance = new MySoftware();
          myInstance.configure({"{"} option1: 'value1' {"}"});
          myInstance.run();
        </code>
      </pre>

      <h2>Support and Contact</h2>
      <p>If you need assistance or have any questions, please contact our support team at support@mysoftware.com.</p>
      <p>
      You can also create your own custom AMI or AMIs; doing so enables you to quickly and easily start new instances that have everything you need. For example, if your application is a website or a web service, your AMI could include a web server, the associated static content, and the code for the dynamic pages. As a result, after you launch an instance from this AMI, your web server starts, and your application is ready to accept requests.

All AMIs are categorized as either backed by Amazon EBS, which means that the root device for an instance launched from the AMI is an Amazon EBS volume, or backed by instance store, which means that the root device for an instance launched from the AMI is an instance store volume created from a template stored in Amazon S3.

The description of an AMI indicates the type of root device (either ebs or instance store). This is important because there are significant differences in what you can do with each type of AMI. For more information about these differences, see Storage for the root device.

You can deregister an AMI when you have finished using it. After you deregister an AMI, you can't use it to launch new instances. Existing instances launched from the AMI are not affected. Therefore, if you are also finished with the instances launched from these AMIs, you should terminate them.
      </p>
      <h2>License</h2>
      <p>MySoftware is licensed under the MIT License. See the <a href="/licenses/mysoftware">License page</a> for details.</p>
    </div>

    <DocsRSB/>
    </>
  )
}

