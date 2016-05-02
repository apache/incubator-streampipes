package de.fzi.cep.sepa.streampipes.codegeneration;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

import de.fzi.cep.sepa.streampipes.codegeneration.flink.*;
import de.fzi.cep.sepa.streampipes.codegeneration.utils.*;

@RunWith(Suite.class)
@SuiteClasses({ ControllerGeneratorTest.class, UtilsTest.class, InitGeneratorTest.class, XmlGeneratorTest.class,
		ProgramGeneratorTest.class, ImplementationGeneratorTest.class, ParametersGeneratorTest.class,
		ConfigGeneratorTest.class })
public class AllTests {

}
