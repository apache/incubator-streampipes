package de.fzi.cep.sepa.model.client.input;


public abstract class FormInput {

	ElementType elementType;
	
	public FormInput()
	{
		super();
	}
	
	public FormInput(ElementType elementType) {
		this.elementType = elementType;
	}

	public ElementType getElementType() {
		return elementType;
	}

	public void setElementType(ElementType elementType) {
		this.elementType = elementType;
	}
	
	
}
