
微软的Visual Parity Test（视觉一致性测试）

是一种用于UI回归测试的验证机制，主要通过对比截图来确保网页或应用程序的视觉界面在不同版本或测试阶段保持一致￼￼￼。

它是Quilla框架中的一种特殊验证状态￼￼￼。Quilla会先生成并保存被认可的截图作为“基准图像”，在后续测试中，Quilla会将新生成的截图（即“处理图像”）与基准图像进行对比，以确定界面是否发生了意外的视觉变化￼￼￼。如果新截图与基准图像不匹配，测试就会失败。

在编写Visual Parity验证时，需要指定一个唯一的基准ID，多个测试文件可以通过指定相同的ID来引用同一个基准图像￼￼￼。此外，为了避免因页面元素的动态变化（如时间、天气等动态组件）导致测试过于脆弱，Quilla允许测试编写者提供一个排除XPath列表，这些元素在对比时会被忽略￼￼￼。

A verification mechanism for UI regression testing, mainly by comparing screenshots to ensure that the visual interface of the web page or application is consistent in different versions or test stages.

It is a special verification state in the Quilla framework. Quilla will make and save the recognized screenshots as "reference/baseline images". In the subsequent test, Quilla will compare the newly generated screenshots (i.e. "processing images") with the benchmark(baselines) images to determine whether there is an unexpected visual change in the interface. If the new screenshot does not match the benchmark image, the test will fail.

When writing Visual Parity verification, you need to specify a unique benchmark ID. Multiple test files can refer to the same benchmark image by specifying the same ID. In addition, in order to avoid the testing being too vulnerable due to dynamic changes in page elements (such as time, weather and other dynamic components), Quilla allows test writers to provide a list of XPath exclusions, which will be ignored during comparison.